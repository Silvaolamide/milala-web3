import {
    Flex,
    Heading,
    Avatar,
    AvatarGroup,
    Text,
    Icon,
    IconButton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Divider,
    Link,
    Box,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {
    FiHome,
    FiPieChart,
    FiDollarSign,
    FiBox,
    FiCalendar,
    FiChevronDown,
    FiChevronUp,
    FiPlus,
    FiCreditCard,
    FiSearch,
    FiBell,
    FiDroplet
} from "react-icons/fi"
import MyChart from '../components/Mychart'
import { Line, Chart } from 'react-chartjs-2'
import { ReactNode } from 'react';
import Web3 from 'web3';
import axios from 'axios';
let empTime = [];
let empValue = [];


// import { ethers } from 'ethers';

import InchModal from "../components/InchModal";

// console.log(data)


export default function Dashboard() {
    const [display, changeDisplay] = useState("hide");
    const [swap, swapChange] = useState("fromto");
    // const [value, setValue] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [value, changeValue] = useState(1);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [userAccount, setUserAccount] = useState(null);
    const [userChain, setUserChain] = useState(null);
    const [userChainId, setUserChainId] = useState(null);
    const [userNetworkName, setUserNetworkName] = useState(null);
    const [persistentLogin, setPersistentLogin] = useState(null);
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [busdData, setBusdData] = useState(null)
    const [dripData, setDripData] = useState(null)
    const [busdBal, setBusdBal] = useState(null)
    const [dripBal, setDripBal] = useState(null)
    const [busdIsLoading, setBusdLoading] = useState(false)
    const [dripIsLoading, setDripLoading] = useState(false)

    const [chrtState, setChrtState] = useState({
        loading: true,
        drip: null,
      });
    const [chartData, setChartData] = useState([]);
    const [chartData2, setChartData2] = useState([]);
    const [chartData3, setChartData3] = useState([]);
    const [employeeSalary, setEmployeeSalary] = useState([]);
    const [employeeAge, setEmployeeAge] = useState([]);

    //I want to hide the dex ui for now
    const [dexTuggle, setDexTuggle] = useState(false)

    let chainId
  
    
// console.log("Jehhhh5", empValue)


    useEffect(() => {
        
        

        let provider = window.ethereum;
        if (typeof provider !== 'undefined') {
            provider.request({ method: 'eth_requestAccounts' }).then(accounts => {
             
                setUserAccount(accounts)
                setPersistentLogin(accounts)
                // Web3.eth.getChainId().then(console.log);
                // console.log(accounts)
                accountChangedHandler(accounts[0]);
                // getUserBalance(accounts[0].toString());
                getChainID();
                
                // Maybe I should make this repeat every 15 secs
                    // const interval = setInterval(() => {
                        
                    
                                
                        const busdAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
                        const holderAddress = "0x8894e0a0c962cb723c1976a4421c95949be2d4e3";
                        const dripHolderAddress = "0x20f663cea80face82acdfa3aae6862d246ce0333";
                

                        // just the `balanceOf()` is sufficient in this case
                        const abiJson = [
                            {"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
                        ];

                        const contract = new web3.eth.Contract(abiJson, busdAddress);
                        const balance = contract.methods.balanceOf(accounts[0]).call()
                            .then(busdBalance => {
                                const calcBusdBal = (busdBalance/(10 ** 18))
                                console.log("addressBalance", calcBusdBal);
                                setBusdBal(calcBusdBal)
                            }).catch(
                                err => {
                                    console.log("network error", err)
                                }
                            );
                        const contract2 = new web3.eth.Contract(abiJson, dripHolderAddress);
                        const balance2 = contract2.methods.balanceOf(accounts[0]).call()
                            .then(dripBalance => {
                                const calcDripBal = (dripBalance/(10 ** 18))
                                console.log("dripBalance", calcDripBal);
                                setDripBal(calcDripBal)
                            }).catch(
                                err => {
                                    console.log("network error", err)
                                }
                            );
                        // const balance = await contract.methods.balanceOf(defaultAccount).call();
                        // note that this number includes the decimal places (in case of BUSD, that's 18 decimal places)
                    // }, 10000);
                    // return () => clearInterval(interval); 
       
            }).catch(err => {
                console.log(err);
                if (err.code === -32603) {
                    window.location.reload()
                } else if (err.code === 4001) {
                    alert("User rejected the request. Please connect your wallet to continue")
                }
            });
        } else {
            alert('Please install Metamask')
        }

        window.ethereum.on('accountsChanged', accountChangedHandler);
        window.ethereum.on('chainChanged', chainChangedHandler)


        
        
        // //tried to get bnb current price from pancakeswap api
        // const web3 = new Web3
        setLoading(true)
        fetch('https://api.pancakeswap.info/api/v2/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c')
          .then((res) => res.json())
          .then((data) => {
            // setData(data)
            //   setLoading(false)
                
        })
        fetch('https://api.pancakeswap.info/api/v2/tokens/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')
          .then((res) => res.json())
          .then((data) => {
            setBusdData(data?.data?.price)
              setBusdLoading(false)
        console.log(data?.data?.price)
          })
        
        ////Tried to get Drip data from Coingecko
          // fetch('https://api.coingecko.com/api/v3/simple/price?ids=drip-network&vs_currencies=usd')
        // // https://api.drip.community/prices/
        //   .then((res) => res.json())
        //     .then((data) => {
        //         setDripData(data["drip-network"]["usd"])
        //         setDripLoading(false)
        //         console.log("drip", data["drip-network"]["usd"])
        // })
        
        

        
        
        const web3 = new Web3(provider);

        //{  although I already have the chainID/NetworkId from Metamask, I just used this block of code
        //to begin testing of web3 }

        //Metamask however gives a warning of Deprecation on Console.log
        //Block to get Id of Network connected to.        
        const networkId = web3.eth.net.getId().then(netId => {
            console.log("network", netId)
        }).catch(
            err => {
                console.log("network error", err)
            }
        );
        // console.log("network", networkId);

        setLoading(true)
        
        //get price from oracle... chainlink is the most popular of them all
        const aggregatorV3InterfaceABI = [{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
        const addr = "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE";
        const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);
        priceFeed.methods.latestRoundData().call()
            .then((roundData) => {
                // Do something with roundData
                const calcRoundData = (roundData.answer * 1) / (10 ** 8)
                setData(calcRoundData)
                setLoading(false)
                console.log("Latest Round Data", calcRoundData)
            });

        
        
        setChrtState({ loading: true });
        const interval = setInterval(() => {
            const apiUrl = `https://api.drip.community/prices`;
            axios
                .get(apiUrl)
                .then((res) => {
                    
                    // res.data.map(time_res => {
                    
                        
                    //         // empTime.push(timeConverter(time_res["time"]))
                    //         empValue.push(time_res["value"])
                        
                    //         setChrtState({ loading: false });
                    // } )

                    console.log(res.data[2490].value)
                    setChrtState({ drip: res.data[2490].value })
                    setDripData(res.data[2490].value )
                    setDripLoading(false)
                });
            
            }, 10000);
            return () => clearInterval(interval);  

        
        
        
        
        
        //To get historical round data you must have valid ID for a latest round datas
            // const aggregatorV3InterfaceABI2 = [{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
            // const addr2 = "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE";
            // const priceFeed2 = new web3.eth.Contract(aggregatorV3InterfaceABI2, addr2);
            
            // // Valid roundId must be known. They are NOT incremental.
            // let validId = BigInt("18446744073709554130");
            
            // priceFeed2.methods.getRoundData(validId).call()
            //     .then((historicalRoundData) => {
            //         // Do something with price
            //         console.log("Historical round data", historicalRoundData);
            //     })
        // to get token balance
        // const tokBal = web3.eth.getBalance(defaultAccount)
        // console.log(tokBal)
        // console.log(defaultAccount)
        

    }, []);

    
    
    
    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        getUserBalance(newAccount.toString());
    }
    const getUserBalance = (address) => {
        window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] }).then(balance => {
            setUserBalance(Web3.utils.fromWei(balance, 'ether'))    
        }).catch(err => {
            console.log(err);
            if (err.code === -32603) {
                window.location.reload()
            }
        });
    }
    const chainChangedHandler = () => {
        window.location.reload()
        // Web3.eth.getChainId().then(console.log);
    }

    // useEffect(() => {
    //     window.location.reload()
    // }, [userAccount]);
    async function getChainID() {

         chainId = await ethereum.request({ method: 'eth_chainId' }).then(chainSymbol => {
             if (chainSymbol == 0x38 || chainSymbol == 0x56) {
                 setUserChain('BNB')
                 setUserNetworkName('Binance Smart Chain')
             }else if(chainSymbol == 0x1){ 
                 setUserChain('ETH')
                 setUserNetworkName('Ethereum')
             }
             setUserChainId(chainSymbol)
         });
         
         
    }
    //connect
    function connect() {
        if (persistentLogin !== null) {
            setUserAccount(persistentLogin)
            accountChangedHandler(persistentLogin);
            getChainID();
        } else {
            ethereum
                .request({ method: 'eth_requestAccounts' })
                .then(accountChangedHandler)
                .catch((error) => {
                    if (error.code === 4001) {
                        // EIP-1193 userRejectedRequest error
                        alert('User rejected the action. Please connect your wallet to continue');
                    } else if (error.code === -32002) {
                        alert('Complete connection from Metamask window');
                    } else {
                        console.error(error);
                    }
                });
        }
    }
    function disconnect() {
        setUserAccount(null)
      }
    // cosnsole.log(chainId, userAccount)
    if(userAccount !== null){
        return (
            <Flex
                h={[null,null,"100vh"]}
                flexDir={["column", "column", "row"]}
                overflow="hidden"
                maxW="2000px"

            >
                
                <Flex
                        w={["100%","100%","10%","15%","15%",]}
                        flexDir="column"
                        alignItems="center"
                        backgroundColor="#001013"
                        color="#B495B1"
                >
                    <Flex
                        flexDir="column"
                        justifyContent="space-between"
                        h={[null,null,"100vh"]}
                        
                    >
                        <Flex
                            flexDir="column"
                            as="nav"
                        
                        >
                            <Heading
                                mt={50}
                                mb={[25, 50, 100]}
                                fontSize={["4xl", "4xl", "2xl", "3xl", "4xl"]}
                                alignSelf="center"
                                letterSpacing="tight"
                            >Mila.</Heading>
                            <Flex
                                flexDir={["row", "row", "column", "column", "column"]}
                                align={["center", "center", "center", "flex-start", "flex-start"]}
                                justifyContent="center"
                                mb={[0, 0, 6, 6, 6]}
                            >
                                <Flex className="sidebar-items"  mr={[2, 6, 0, 0, 0]}  mb={[0, 0, 6, 6, 6]}>
                                    <Link display={["none", "none", "flex", "flex", "flex"]} >
                                        <Icon as={FiHome} fontSize="2xl"  />
                                    </Link>
                                    <Link _hover={{textDecor: 'none'}} display={["flex", "flex", "none", "flex", "flex"]}>
                                        <Text>Home</Text>

                                    </Link>
                                </Flex>
                                <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}  mb={[0, 0, 6, 6, 6]}>
                                    <Link display={["none", "none", "flex", "flex", "flex"]} >
                                        <Icon   as={FiDroplet} fontSize="2xl" className="active-icon" />
                                    </Link>
                                    <Link _hover={{textDecor: 'none'}} display={["flex", "flex", "none", "flex", "flex"]}>
                                        <Text className="active">Dashboard </Text>

                                    </Link>
                                </Flex>
                                <Flex className="sidebar-items"  mr={[2, 6, 0, 0, 0]}  mb={[0, 0, 6, 6, 6]}>
                                    <Link display={["none", "none", "flex", "flex", "flex"]} >
                                        <Icon  as={FiPieChart} fontSize="2xl" />
                                    </Link>
                                    <Link _hover={{textDecor: 'none'}} display={["flex", "flex", "none", "flex", "flex"]}>
                                        <Text>Wallet</Text>

                                    </Link>
                                </Flex>
                                <Flex className="sidebar-items"  mr={[2, 6, 0, 0, 0]}  mb={[0, 0, 6, 6, 6]}>
                                    <Link display={["none", "none", "flex", "flex", "flex"]} >
                                        <Icon  as={FiBox} fontSize="2xl" />
                                    </Link>
                                    <Link _hover={{textDecor: 'none'}} display={["flex", "flex", "none", "flex", "flex"]}>
                                        <Text>Services</Text>

                                    </Link>
                                </Flex>
                            </Flex>
                          

                        </Flex> 
                        <Flex flexDir="column" alignItems="center" mb={10} mt={5}>
                                <Avatar my={2} src="avatar-1.jpg" />
                                <Text textAlign="center">Ola Silva A.</Text>
                        </Flex>
                        

                    </Flex>
                    
                </Flex>
                {/* column 2 */}
                <Flex
                    w={["100%","100%","60%","60%","55%",]}
                    p="3%"
                    flexDir="column"
                    overflow="auto"
                    minH="100vh"
                >
                    <Heading fontWeight="normal">Wallet <Flex fontWeight="bold" display="inline-flex">Balance</Flex></Heading>
                    
                    <Text fontWeight="bold" fontSize="2xl">{userBalance} {userChain}</Text>
                    <Text color="gray" fontSize="sm">{isLoading ? "Loading" : "$" + (data * userBalance).toFixed(2)}</Text>
                    {/* <Text color="gray" fontSize="sm">{isLoading? "Loading": "$"+(data?.data?.price  * userBalance).toFixed(2)}</Text> */}
                  
                    
                    <Flex justifyContent="space-between" mt={8} align='center' >
                        
                        <Text fontSize="sm" color="gray.700" fontWeight="bold">Drip/USDT: ${chrtState.drip}</Text>
                        <Button borderRadius="20px" w="auto" boxShadow="xl" variant="outline" fontSize='x-small' mr={0} >24hr</Button>
                        
                    </Flex>
                    <MyChart />
                    <Flex justifyContent="space-between" mt={8}>
                        <Flex align="flex-end">
                            <Heading as="h2" size="lg" letterSpacing="Tight">Token Balances</Heading>
                            <Text fontSize="sm" color="gray" ml={4}>Apr 2021</Text>
                        </Flex>
                        <IconButton icon={<FiCalendar />} />
                        
                    </Flex>
                    <Flex flexDir="column" fontSize="smaller"  >
                            <Flex overflow="auto">
                                <Table variant="unstyled" mt={4}>
                                    <Thead>
                                        <Tr color="gray">
                                            <Th>Token</Th>
                                            <Th> Balance</Th>
                                          
                                            <Th isNumeric> Decimals</Th>
                                        </Tr>
                                </Thead>
                                <Tbody>
                                   
                                    
                                    {display === 'show' && 
                                        <>
                                            <Tr>
                                            <Td>
                                                <Flex align="center">
                                                    <Avatar size="sm" mr={2} src="avatar-1.jpg" />
                                                    <Flex flexDir="column">
                                                        <Heading size="sm" letterSpacing="tight">Amazon</Heading>
                                                        <Text fontSize="sm" color="gray">Apr 24, 2021 at 1:40pm</Text>
                                                    </Flex>
                                                </Flex>
                                            </Td>
                                                <Td>  Electronic Devices </Td>
                                                <Td isNumeric> +2$</Td>
                                                <Td isNumeric> <Text fontWeight="bold" display="inline-table">-$242</Text>.00</Td>
                                            </Tr><Tr>
                                            <Td>
                                                <Flex align="center">
                                                    <Avatar size="sm" mr={2} src="avatar-1.jpg" />
                                                    <Flex flexDir="column">
                                                        <Heading size="sm" letterSpacing="tight">Amazon</Heading>
                                                        <Text fontSize="sm" color="gray">Apr 24, 2021 at 1:40pm</Text>
                                                    </Flex>
                                                </Flex>
                                            </Td>
                                                <Td>  Electronic Devices </Td>
                                                <Td isNumeric> +2$</Td>
                                                <Td isNumeric> <Text fontWeight="bold" display="inline-table">-$242</Text>.00</Td>
                                            </Tr><Tr>
                                            <Td>
                                                <Flex align="center">
                                                    <Avatar size="sm" mr={2} src="avatar-1.jpg" />
                                                    <Flex flexDir="column">
                                                        <Heading size="sm" letterSpacing="tight">Amazon</Heading>
                                                        <Text fontSize="sm" color="gray">Apr 24, 2021 at 1:40pm</Text>
                                                    </Flex>
                                                </Flex>
                                            </Td>
                                                <Td>  Electronic Devices </Td>
                                                <Td isNumeric> +2$</Td>
                                                <Td isNumeric> <Text fontWeight="bold" display="inline-table">-$242</Text>.00</Td>
                                        </Tr>
                                        </>
                                    }
                                    </Tbody>
                                </Table>
                        </Flex>
                        <Flex align="center">
                            <Divider />
                            <IconButton
                                icon={display === 'show' ? <FiChevronUp /> : <FiChevronDown />}
                                onClick={() => {
                                    if (display == 'show') {
                                        changeDisplay('none')
                                    } else {
                                        changeDisplay('show')
                                    }
                                } 

                                } />
                            <Divider />
                        </Flex>
                    </Flex>
                    
                </Flex>
                {/* column 3 */}
                <Flex
                    w={["100%", "100%", "35%"]}
                    minW={[null, null, "300px", "300px", "400px"]}
                    bgColor="#F5F5F5"
                    p="3%"
                    flexDir="column"
                    overflow="auto"
                >
                    <Flex alignContent="center">
                        <Button
                            // bgGradient='linear(to-l, #7928CA, #FF0080)'
                            id="button-connect-wallet"
                            borderRadius="3xl"
                            border='1px' w="100%"
                            borderColor='gray.200'
                            py="6"
                            fontSize="sm"
                            letterSpacing="wide"
                            fontWeight="bold"
                            onClick={() => disconnect()}
                        >
                            {defaultAccount}
                        </Button>
                         
                    
                    </Flex>
                    <Flex alignContent="center">
                        <Heading letterSpacing="tight" mt="5">Wallet</Heading>
                        
                    </Flex>
                    {value == 1 &&
                            <Box
                                borderRadius="25px"
                                mt={4}
                                w="100%"
                                h="200px"
                                bgGradient="linear(to-t, #B57295, #29259A)"
                                boxShadow="md"
                                
                                
                            >
                            <Flex p="1em" color="#fff" flexDir="column" h="100%" justify="space-between" >
                                <Flex justify="space-between" w="100%" align="flex-start">
                                    <Flex flexDir="column">
                                        <Text color="gray.400">Current {userChain} Balance</Text>
                                        <Text fontWeight="bold" fontSize="xl">{userBalance} {userChain}</Text>
                                    </Flex>
                                    <Flex align="center">
                                        <Icon mr={2} as={FiCreditCard} />
                                        <Text>Mila.</Text>
                                    </Flex>
                                </Flex>
                                <Text mb={4}>{isLoading? "Loading": "$"+(data  * userBalance).toFixed(4)} - [${((data)*1).toFixed(4)}]</Text>
                                {/* <Text mb={4}>{isLoading? "Loading": "$"+(data?.data?.price  * userBalance).toFixed(2)} - [${((data?.data?.price)*1).toFixed(2)}]</Text> */}
                                <Flex align="flex-end" justify="space-between">
                                    <Flex>
                                        <Flex flexDir="column" mr={4}>
                                            <Text textTransform="uppercase" color="#D8ABD8" fontSize="xs">Chain ID</Text>
                                            <Text fontSize="sm"  fontWeight="semibold">{userChainId}</Text>
                                        </Flex>
                                        <Flex flexDir="column">
                                            <Text textTransform="uppercase" fontSize="xs" color="#D8ABD8">Network Name</Text>
                                            <Text fontSize="sm" fontWeight="semibold">{userNetworkName}</Text>
                                        </Flex>
                                    </Flex>
                                    <Icon as={FiCreditCard} />
                                </Flex>
                            </Flex>
                            </Box>
                    }
                    {value == 2 &&
                            <Box
                                borderRadius="25px"
                                mt={4}
                                w="100%"
                                h="200px"
                                bgGradient="linear(to-t, #1f306e, #f5487f)"
                                
                            >
                            <Flex p="1em" color="#fff" flexDir="column" h="100%" justify="space-between" >
                                <Flex justify="space-between" w="100%" align="flex-start">
                                    <Flex flexDir="column">
                                        <Text color="#CDFFF9">Current BUSD Balance</Text>
                                        <Text fontWeight="bold" fontSize="xl">{busdBal}</Text>
                                    </Flex>
                                    <Flex align="center">
                                        <Icon mr={2} as={FiCreditCard} />
                                        <Text>Mila.</Text>
                                    </Flex>
                                </Flex>
                                {/* <Text mb={4}>{busdIsLoading? "Loading": "$"+(busdData?.busdData?.price  * userBalance).toFixed(2)}</Text> */}
                                <Text mb={4}>{busdIsLoading? "Loading": "$"+parseFloat(busdData)}</Text>
                                <Flex align="flex-end" justify="space-between">
                                    <Flex>
                                        <Flex flexDir="column" mr={4}>
                                            <Text textTransform="uppercase" color="#CDFFF9" fontSize="xs">Chain ID</Text>
                                            <Text fontSize="sm"  fontWeight="semibold">{userChainId}</Text>
                                        </Flex>
                                        <Flex flexDir="column">
                                            <Text textTransform="uppercase" fontSize="xs" color="#CDFFF9">Network Name</Text>
                                            <Text fontSize="sm" fontWeight="semibold">{userNetworkName}</Text>
                                        </Flex>
                                    </Flex>
                                    <Icon as={FiCreditCard} />
                                </Flex>
                            </Flex>
                            </Box>
                    }
                    
                      {value == 3 &&
                            <Box
                                borderRadius="25px"
                                mt={4}
                                w="100%"
                                h="200px"
                                bgGradient="linear(to-t, orange.300, pink.600)"
                                
                            >
                            <Flex p="1em" color="#fff" flexDir="column" h="100%" justify="space-between" >
                                <Flex justify="space-between" w="100%" align="flex-start">
                                    <Flex flexDir="column">
                                        <Text color="gray.400">Current Drip Balance</Text>
                                        <Text fontWeight="bold" fontSize="xl">{dripBal} Drip</Text>
                                        
                                    </Flex>
                                    <Flex align="center">
                                        <Icon mr={2} as={FiCreditCard} />
                                        <Text>Mila.</Text>
                                    </Flex>
                                </Flex>
                                <Text mb={4}>{dripIsLoading? "Loading": "$"+parseFloat(dripData)*dripBal}</Text>
                                <Flex align="flex-end" justify="space-between">
                                    <Flex>
                                        <Flex flexDir="column" mr={4}>
                                            <Text textTransform="uppercase" fontSize="xs">Drip Price</Text>
                                            <Text fontSize="lg">{dripIsLoading? "Loading": "$"+parseFloat(dripData)}</Text>
                                        </Flex>
                                        <Flex flexDir="column">
                                            <Text textTransform="uppercase" fontSize="xs">CW</Text>
                                            <Text fontSize="lg">***</Text>
                                        </Flex>
                                    </Flex>
                                    <Icon as={FiCreditCard} />
                                </Flex>
                            </Flex>
                            </Box>
                    }
                    <Flex justifyContent="center" mt={2}>
                        <Button bgColor={value == 1 ? "gray.600" : 'gray.400'} onClick={() => changeValue(1)} size="xs" mx={1}/>
                        <Button bgColor={value == 2 ? "gray.600" : 'gray.400'} onClick={() => changeValue(2)} size="xs" mx={1}/>
                        <Button bgColor={value == 3 ? "gray.600" : 'gray.400'} onClick={() => changeValue(3)} size="xs" mx={1}/>
                    </Flex>
                    
                    <Box bg="#ffffff" p={4} mt={8} borderRadius="20px" border='0px' borderColor="#dc35464b" boxShadow="xl" color="gray.700" >
                            <Flex flexDir="column">
                                <Flex flexDir="row" justifyContent="space-between">
                                    <Text fontWeight="medium">Swap</Text>
                                    
                                    <Flex flexDir="row" align="center" >
                                        <Flex flexDir="column" >
                                        <Text fontSize="xs" fontWeight="bold" mx="2" align="end">walletTokenBalance</Text>
                                            <Text fontSize="xs" fontWeight="bold" mx="2" align="end">tokenBalance</Text>
                                        </Flex>
                                        <Button borderRadius="20px" w="auto" boxShadow="xl" variant="outline"  fontSize="sm" >max</Button>
                                    </Flex>
                                </Flex>
                                
                                <Flex flexDir="row" p={6} mt={4} borderRadius="20px" bgColor="gray.200" align="center" justify="space-between">
                                  
                                        <Input
                                            placeholder="0.0"
                                            w="50%"
                                            _hover={{
                                                border: '0px'
                                            }}
                                            // onChange={handleFromAmountChange}
                                            // value={fromAmount}
                                            // value={fromAmount? fromAmount:0}
                                        />
                                    
                                        
                                    <Button borderRadius="20px" w="auto" boxShadow="xl" fontSize="sm" onClick={() => setFromModalActive(true)}>
                                            {/* <Icon as={FiDroplet} mx={3} /> */}
                                           
                                            <span pl="5px"> fromToken?.symbol</span>
                                            <Icon as={FiChevronDown} mx={3} />
                                    
                                            </Button>
                                    
                                   
                                </Flex>
                                <Flex flexDir="row" justifyContent="flex-end">
                                    <Text fontSize="xs" fontWeight="bold" >fromTokenPriceUsd</Text>
                                  
                                </Flex>
                                
                                <Flex align="center" mt={3}>
                                    <Divider />
                                    <IconButton
                                        icon={<><FiChevronUp /> <FiChevronDown /></>}
                                        onClick={() => {
                                            if (swap == 'fromto') {
                                                swapChange('tofrom')
                                            } else {
                                                swapChange('fromto')
                                            }
                                        }

                                        } />
                                
                                    {/* <IconButton
                                    icon={display === 'show' ? <FiChevronUp /> : <FiChevronDown />}
                                    onClick={() => {
                                        if (display == 'show') {
                                            changeDisplay('none')
                                        } else {
                                            changeDisplay('show')
                                        }
                                    }

                                    } /> */}
                                    <Divider />
                                </Flex>
                            
                                <Flex flexDir="row" p={6} mt={3} borderRadius="20px" bgColor="gray.200" align="center"  justify="space-between">
                                    <Input
                                        placeholder="0.0"
                                        w="50%"
                                        _hover={{
                                            border: '0px'
                                        }}
                                        // value={quote ? Moralis.Units.FromWei(quote?.toTokenAmount, quote?.toToken?.decimals).toFixed(6) : ""}

                                    />
                                
        <Button borderRadius="20px" boxShadow="xl" w="auto" fontSize="sm" onClick={() => setToModalActive(true)}>
      
              <span> toToken?.symbol</span>
            <Icon as={FiChevronDown} mx={2} />
            
        </Button>
                                    
                                
                                </Flex>
                                <Flex flexDir="row" justifyContent="flex-end">
                                    <Text fontSize="xs" fontWeight="bold" >toTokenPriceUsd</Text>
                                  
                                </Flex>
                              
                                <Button
                                    py={5}
                                    borderRadius="15px"
                                    bgColor="#dc35464b"
                                    // isDisabled={buttonEnable}
                                    mt={5}
                                    // onClick={() => trySwap(currentTrade)}
                                >Swap</Button>
                              
                            </Flex>
                            <Flex>
                            
                            </Flex>
                        </Box>
                        
                    {(dexTuggle && (swap == "fromto")) &&
                        <Box bg="#ffffff" p={4} mt={8} borderRadius="20px" border='0px' borderColor="#dc35464b" boxShadow="xl" color="gray.700" >
                            <Flex flexDir="column">
                                <Flex flexDir="row" justifyContent="space-between">
                                    <Text fontWeight="medium">Swap</Text>
                                    
                                    <Flex flexDir="row" align="center" >
                                        <Flex flexDir="column" >
                                        <Text fontSize="xs" fontWeight="bold" mx="2" align="end">walletTokenBalance</Text>
                                            <Text fontSize="xs" fontWeight="bold" mx="2" align="end">tokenBalance</Text>
                                        </Flex>
                                        <Button borderRadius="20px" w="auto" boxShadow="xl" variant="outline"  fontSize="sm" >max</Button>
                                    </Flex>
                                </Flex>
                                
                                <Flex flexDir="row" p={6} mt={4} borderRadius="20px" bgColor="gray.200" align="center" justify="space-between">
                                  
                                        <Input
                                            placeholder="0.0"
                                            w="50%"
                                            _hover={{
                                                border: '0px'
                                            }}
                                            // onChange={handleFromAmountChange}
                                            // value={fromAmount}
                                            // value={fromAmount? fromAmount:0}
                                        />
                                    
                                        
                                    <Button borderRadius="20px" w="auto" boxShadow="xl" fontSize="sm" onClick={() => setFromModalActive(true)}>
                                            {/* <Icon as={FiDroplet} mx={3} /> */}
                                           
                                            <span pl="5px"> fromToken?.symbol</span>
                                            <Icon as={FiChevronDown} mx={3} />
                                    
                                            </Button>
                                    
                                   
                                </Flex>
                                <Flex flexDir="row" justifyContent="flex-end">
                                    <Text fontSize="xs" fontWeight="bold" >fromTokenPriceUsd</Text>
                                  
                                </Flex>
                                
                                <Flex align="center" mt={3}>
                                    <Divider />
                                    <IconButton
                                        icon={<><FiChevronUp /> <FiChevronDown /></>}
                                        onClick={() => {
                                            if (swap == 'fromto') {
                                                swapChange('tofrom')
                                            } else {
                                                swapChange('fromto')
                                            }
                                        }

                                        } />
                                
                                    {/* <IconButton
                                    icon={display === 'show' ? <FiChevronUp /> : <FiChevronDown />}
                                    onClick={() => {
                                        if (display == 'show') {
                                            changeDisplay('none')
                                        } else {
                                            changeDisplay('show')
                                        }
                                    }

                                    } /> */}
                                    <Divider />
                                </Flex>
                            
                                <Flex flexDir="row" p={6} mt={3} borderRadius="20px" bgColor="gray.200" align="center"  justify="space-between">
                                    <Input
                                        placeholder="0.0"
                                        w="50%"
                                        _hover={{
                                            border: '0px'
                                        }}
                                        // value={quote ? Moralis.Units.FromWei(quote?.toTokenAmount, quote?.toToken?.decimals).toFixed(6) : ""}

                                    />
                                
        <Button borderRadius="20px" boxShadow="xl" w="auto" fontSize="sm" onClick={() => setToModalActive(true)}>
      
              <span> toToken?.symbol</span>
            <Icon as={FiChevronDown} mx={2} />
            
        </Button>
                                    
                                
                                </Flex>
                                <Flex flexDir="row" justifyContent="flex-end">
                                    <Text fontSize="xs" fontWeight="bold" >toTokenPriceUsd</Text>
                                  
                                </Flex>
                              
                                <Button
                                    py={5}
                                    borderRadius="15px"
                                    bgColor="#dc35464b"
                                    // isDisabled={buttonEnable}
                                    mt={5}
                                    // onClick={() => trySwap(currentTrade)}
                                >Swap</Button>
                              
                            </Flex>
                            <Flex>
                            
                            </Flex>
                        </Box>
                    }
                    {(dexTuggle && (swap === "tofrom"))  &&
                    <Box bg="#ffffff" p={4} mt={8} borderRadius="20px" border='0px' borderColor="#dc35464b" boxShadow="xl">
                            <Flex flexDir="column">
                                <Text fontWeight="medium">Swap</Text>
                                <Flex flexDir="row" p={6} mt={4} borderRadius="20px" bgColor="gray.200" align="center" justify="space-between">
                                  
                                        <Input
                                        placeholder="0.0"
                                        w="50%"
                                        _hover={{
                                             border: '0px'
                                            }}
                                       
                                        />
                                    
                                        
                                    <Button borderRadius="20px" w="auto" boxShadow="xl" fontSize="sm" onClick={() => setToModalActive(true)}>
                                            {/* <Icon as={FiDroplet} mx={3} /> */}
                                            {/* {toToken ? (
                                                <img
                                                src={toToken?.logoURI || "https://etherscan.io/images/main/empty-token.png"}
                                                alt="nologo"
                                                width="30px"
                                                preview={false}
                                                style={{ borderRadius: "15px", paddingRight:"5px" }}
                                                />
                                            ) : (
                                                <span>Select a token</span>
                                            )} */}
                                            <span pl="5px"> toToken?.symbol</span>
                                            <Icon as={FiChevronDown} mx={3} />
                                    
                                            </Button>
                                           
                                   
                                </Flex>
                                <Flex align="center" mt={3}>
                                    <Divider />
                                    <IconButton
                                        icon={<><FiChevronUp /> <FiChevronDown /></>}
                                        onClick={() => {
                                            if (swap == 'fromto') {
                                                swapChange('tofrom')
                                            } else {
                                                swapChange('fromto')
                                            }
                                        }

                                        } />
                                
                                    {/* <IconButton
                                    icon={display === 'show' ? <FiChevronUp /> : <FiChevronDown />}
                                    onClick={() => {
                                        if (display == 'show') {
                                            changeDisplay('none')
                                        } else {
                                            changeDisplay('show')
                                        }
                                    }

                                    } /> */}
                                    <Divider />
                                </Flex>
                            
                                <Flex flexDir="row" p={6} mt={3} borderRadius="20px" bgColor="gray.200" align="center"  justify="space-between">
                                    <Input
                                        placeholder="0.0"
                                        w="50%"
                                        _hover={{
                                            border: '0px'
                                        }}
                                        

                                    />
                                
        <Button borderRadius="20px" boxShadow="xl" w="auto" fontSize="sm" onClick={() => setFromModalActive(true)}>
        {/* {fromToken ? (
                <img
                  src={fromToken?.logoURI || "https://etherscan.io/images/main/empty-token.png"}
                  alt="nologo"
                  width="30px"
                  preview={false}
                                                style={{ borderRadius: "15px", paddingRight:"5px" }}
                />
              ) : (
                <span>Select a token</span>
              )} */}
              <span> fromToken?.symbol</span>
            <Icon as={FiChevronDown} mx={2} />
            
        </Button>
                                    
                                
                                </Flex>
                                <Button py={5} borderRadius="15px" bgColor="#dc35464b" mt={5}>Swap</Button>
                            </Flex>
                            <Flex>
                            
                            </Flex>
                        </Box>
                    }
                   
                   
                    <Heading size="sm" letterSpacing="tight" my={4} mt={8}>Send money to</Heading>
                    <Flex>
                        <AvatarGroup size="md" max={3}>
                            <Avatar src="avatar-1.jpg"/>
                            <Avatar src="avatar-1.jpg"/>
                            <Avatar src="avatar-1.jpg"/>
                            <Avatar src="avatar-1.jpg"/>
                            <Avatar src="avatar-1.jpg"/>
                            <Avatar icon={<FiPlus />} ml="2" color="fff" bgColor="gray.300" />
                        </AvatarGroup>
                    </Flex>
                    <Text color="gray" mt={10} mb={2}>Card Number</Text>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none"> 
                            
                            <FiCreditCard color="gray.700"/>
                        </InputLeftElement> 
                        <Input type="number" placeholder="**** **** **** ****"/>
                    </InputGroup>
                    <Text color="gray" mt={2} mb={2}>Sum</Text>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none"> 
                           
                             <FiCreditCard color="gray.700"/>
                        </InputLeftElement> 
                        <Input type="number" placeholder="1300.00"/>
                    </InputGroup>
                    <Button mt={4} bgColor="blackAlpha.900" color="#fff" p={7} borderRadius="15">Send Money</Button>
                </Flex>
          
            </Flex>
            
        )
    } 
    return (
            <Flex
                h={[null,null,"100vh"]}
                flexDir={["column", "column", "row"]}
                overflow="hidden"
                maxW="2000px"

            >
                <Flex
                    w={["100%","100%","10%","15%","15%",]}
                    flexDir="column"
                    alignItems="center"
                    backgroundColor="#001013"
                    color="#B495B1"
                >
                    <Flex
                        flexDir="column"
                        justifyContent="space-between"
                        h={[null,null,"100vh"]}
                        
                    >
                        <Flex
                            flexDir="column"
                            as="nav"
                        
                        >
                            <Heading
                                mt={50}
                                mb={[25, 50, 100]}
                                fontSize={["4xl", "4xl", "2xl", "3xl", "4xl"]}
                                alignSelf="center"
                                letterSpacing="tight"
                            >Mila.</Heading>
                            <Flex
                                flexDir={["row", "row", "column", "column", "column"]}
                                align={["center", "center", "center", "flex-start", "flex-start"]}
                                justifyContent="center"
                                mb={[0, 0, 6, 6, 6]}
                            >
                                <Flex className="sidebar-items"  mr={[2, 6, 0, 0, 0]}  mb={[0, 0, 6, 6, 6]}>
                                    <Link display={["none", "none", "flex", "flex", "flex"]} >
                                        <Icon as={FiHome} fontSize="2xl"  />
                                    </Link>
                                    <Link _hover={{textDecor: 'none'}} display={["flex", "flex", "none", "flex", "flex"]}>
                                        <Text>Home</Text>

                                    </Link>
                                </Flex>
                                <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}  mb={[0, 0, 6, 6, 6]}>
                                    <Link display={["none", "none", "flex", "flex", "flex"]} >
                                        <Icon   as={FiDroplet} fontSize="2xl" className="active-icon" />
                                    </Link>
                                    <Link _hover={{textDecor: 'none'}} display={["flex", "flex", "none", "flex", "flex"]}>
                                        <Text className="active">Dashboard</Text>

                                    </Link>
                                </Flex>
                                <Flex className="sidebar-items"  mr={[2, 6, 0, 0, 0]}  mb={[0, 0, 6, 6, 6]}>
                                    <Link display={["none", "none", "flex", "flex", "flex"]} >
                                        <Icon  as={FiPieChart} fontSize="2xl" />
                                    </Link>
                                    <Link _hover={{textDecor: 'none'}} display={["flex", "flex", "none", "flex", "flex"]}>
                                        <Text>Wallet</Text>

                                    </Link>
                                </Flex>
                                <Flex className="sidebar-items"  mr={[2, 6, 0, 0, 0]}  mb={[0, 0, 6, 6, 6]}>
                                    <Link display={["none", "none", "flex", "flex", "flex"]} >
                                        <Icon  as={FiBox} fontSize="2xl" />
                                    </Link>
                                    <Link _hover={{textDecor: 'none'}} display={["flex", "flex", "none", "flex", "flex"]}>
                                        <Text>Services</Text>

                                    </Link>
                                </Flex>
                            </Flex>

                        </Flex>
                        <Flex flexDir="column" alignItems="center" mb={10} mt={5}>
                            <Avatar my={2} src="avatar-1.jpg" />
                            <Text textAlign="center">Ola Silva A.</Text>
                        </Flex>
                        

                    </Flex>
                    
                </Flex>
                {/* column 2 */}
                <Flex
                         w={["100%","100%","60%","60%","55%",]}
                    p="3%"
                    flexDir="column"
                    overflow="auto"
                    minH="100vh"
                >
                    <Heading fontWeight="normal">Milala, <Flex fontWeight="bold" display="inline-flex">Blockchain.</Flex></Heading>
                    <Text color="gray" fontSize="sm">Invest in African Businesses from anywhere</Text>
                <Text fontWeight="bold" fontSize="2xl">Connect Wallet</Text>
                <Flex justifyContent="space-between" mt={8} align='center' >
                        
                        <Text fontSize="sm" color="gray.700" fontWeight="bold">Drip/USDT: ${chrtState.drip}</Text>
                        <Button borderRadius="20px" w="auto" boxShadow="xl" variant="outline" fontSize='x-small' mr={0} >24hr</Button>
                        
                    </Flex>
                 <MyChart />
                    <Flex justifyContent="space-between" mt={8}>
                        <Flex align="flex-end">
                            <Heading as="h2" size="lg" letterSpacing="Tight">Transactions</Heading>
                            <Text fontSize="sm" color="gray" ml={4}>Apr 2021</Text>
                        </Flex>
                        <IconButton icon={<FiCalendar />} />
                        
                    </Flex>
                    <Flex flexDir="column" fontSize="smaller">
                        <Flex overflow="auto">
                            <Table variant="unstyled" mt={4}>
                                <Thead>
                                    <Tr color="gray">
                                        <Th> Name of Transation</Th>
                                        <Th> Category</Th>
                                        <Th isNumeric> Cashback</Th>
                                        <Th isNumeric> Amount</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>
                                            <Flex align="center">
                                                <Avatar size="sm" mr={2} src="avatar-1.jpg" />
                                                <Flex flexDir="column">
                                                    <Heading size="sm" letterSpacing="tight">Amazon</Heading>
                                                    <Text fontSize="sm" color="gray">Apr 24, 2021 at 1:40pm</Text>
                                                </Flex>
                                            </Flex>
                                        </Td>
                                        <Td>  Electronic Devices </Td>
                                        <Td isNumeric> +2$</Td>
                                        <Td isNumeric> <Text fontWeight="bold" display="inline-table">-$242</Text>.00</Td>
                                    </Tr><Tr>
                                        <Td>
                                            <Flex align="center">
                                                <Avatar size="sm" mr={2} src="avatar-1.jpg" />
                                                <Flex flexDir="column">
                                                    <Heading size="sm" letterSpacing="tight">Amazon</Heading>
                                                    <Text fontSize="sm" color="gray">Apr 24, 2021 at 1:40pm</Text>
                                                </Flex>
                                            </Flex>
                                        </Td>
                                        <Td>  Electronic Devices </Td>
                                        <Td isNumeric> +2$</Td>
                                        <Td isNumeric> <Text fontWeight="bold" display="inline-table">-$242</Text>.00</Td>
                                    </Tr><Tr>
                                        <Td>
                                            <Flex align="center">
                                                <Avatar size="sm" mr={2} src="avatar-1.jpg" />
                                                <Flex flexDir="column">
                                                    <Heading size="sm" letterSpacing="tight">Amazon</Heading>
                                                    <Text fontSize="sm" color="gray">Apr 24, 2021 at 1:40pm</Text>
                                                </Flex>
                                            </Flex>
                                        </Td>
                                        <Td>  Electronic Devices </Td>
                                        <Td isNumeric> +2$</Td>
                                        <Td isNumeric> <Text fontWeight="bold" display="inline-table">-$242</Text>.00</Td>
                                    </Tr>
                                    {display === 'show' &&
                                        <>
                                            <Tr>
                                                <Td>
                                                    <Flex align="center">
                                                        <Avatar size="sm" mr={2} src="avatar-1.jpg" />
                                                        <Flex flexDir="column">
                                                            <Heading size="sm" letterSpacing="tight">Amazon</Heading>
                                                            <Text fontSize="sm" color="gray">Apr 24, 2021 at 1:40pm</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Td>
                                                <Td>  Electronic Devices </Td>
                                                <Td isNumeric> +2$</Td>
                                                <Td isNumeric> <Text fontWeight="bold" display="inline-table">-$242</Text>.00</Td>
                                            </Tr><Tr>
                                                <Td>
                                                    <Flex align="center">
                                                        <Avatar size="sm" mr={2} src="avatar-1.jpg" />
                                                        <Flex flexDir="column">
                                                            <Heading size="sm" letterSpacing="tight">Amazon</Heading>
                                                            <Text fontSize="sm" color="gray">Apr 24, 2021 at 1:40pm</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Td>
                                                <Td>  Electronic Devices </Td>
                                                <Td isNumeric> +2$</Td>
                                                <Td isNumeric> <Text fontWeight="bold" display="inline-table">-$242</Text>.00</Td>
                                            </Tr><Tr>
                                                <Td>
                                                    <Flex align="center">
                                                        <Avatar size="sm" mr={2} src="avatar-1.jpg" />
                                                        <Flex flexDir="column">
                                                            <Heading size="sm" letterSpacing="tight">Amazon</Heading>
                                                            <Text fontSize="sm" color="gray">Apr 24, 2021 at 1:40pm</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Td>
                                                <Td>  Electronic Devices </Td>
                                                <Td isNumeric> +2$</Td>
                                                <Td isNumeric> <Text fontWeight="bold" display="inline-table">-$242</Text>.00</Td>
                                            </Tr>
                                        </>
                                    }
                                </Tbody>
                            </Table>
                        </Flex>
                        <Flex align="center">
                            <Divider />
                            <IconButton
                                icon={display === 'show' ? <FiChevronUp /> : <FiChevronDown />}
                                onClick={() => {
                                    if (display == 'show') {
                                        changeDisplay('none')
                                    } else {
                                        changeDisplay('show')
                                    }
                                }

                                } />
                            <Divider />
                        </Flex>
                    </Flex>
                    
                </Flex>
                {/* column 3 */}
                <Flex
                         w={["100%", "100%", "35%"]}
                    minW={[null, null, "300px", "300px", "400px"]}
                    bgColor="#F5F5F5"
                    p="3%"
                    flexDir="column"
                    overflow="auto"
                >
                    <Flex alignContent="center">
                        <Button
                            // bgGradient='linear(to-l, #7928CA, #FF0080)'
                            id="button-connect-wallet"
                            borderRadius="3xl"
                            border='1px' w="100%"
                            borderColor='gray.200'
                            py="6"
                            fontSize="sm"
                            letterSpacing="wide"
                        fontWeight="bold"
                            onClick={() => connect()}
                            // isLoading={isAuthenticating} onClick={() => authenticate()}
                        >
                            Connect Wallet
                         </Button>
                         

                    
                    </Flex>
                    <Flex alignContent="center" >
                    
                    </Flex>
                
                        
                </Flex>

            </Flex>
    )
    
    
}




