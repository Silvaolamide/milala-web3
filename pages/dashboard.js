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
import { ReactNode } from 'react';
import Web3 from 'web3';


// import { ethers } from 'ethers';

import InchModal from "../components/InchModal";

// console.log(data)


export default function Dashboard() {
    const [display, changeDisplay] = useState("hide");
    const [swap, swapChange] = useState("fromto");
    const [value, setValue] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [userAccount, setUserAccount] = useState(null);
    const [userChain, setUserChain] = useState(null);
    const [userChainId, setUserChainId] = useState(null);
    const [userNetworkName, setUserNetworkName] = useState(null);
    const [persistentLogin, setPersistentLogin] = useState(null);
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)

    let chainId

    useEffect(() => {
        // const web3 = new Web3
        setLoading(true)
        fetch('https://api.pancakeswap.info/api/v2/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c')
          .then((res) => res.json())
          .then((data) => {
            setData(data)
              setLoading(false)
                
          })
          
        
        let provider = window.ethereum;
        if (typeof provider !== 'undefined') {
            provider.request({ method: 'eth_requestAccounts' }).then(accounts => {
             
                setUserAccount(accounts)
                setPersistentLogin(accounts)
                // Web3.eth.getChainId().then(console.log);
                // console.log(accounts)
                accountChangedHandler(accounts[0]);
                getChainID();
                
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
                    <Heading fontWeight="normal">Welcome back,, <Flex fontWeight="bold" display="inline-flex">Ola Silva A.</Flex></Heading>
                    <Text color="gray" fontSize="sm">{isLoading? "Loading": "$"+(data?.data?.price  * userBalance).toFixed(2)}</Text>
                    <Text fontWeight="bold" fontSize="2xl">{userBalance} {userChain}</Text>
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
                                        <Text color="gray.400">Current Balance</Text>
                                        <Text fontWeight="bold" fontSize="xl">{userBalance} {userChain}</Text>
                                    </Flex>
                                    <Flex align="center">
                                        <Icon mr={2} as={FiCreditCard} />
                                        <Text>Mila.</Text>
                                    </Flex>
                                </Flex>
                                <Text mb={4}>{isLoading? "Loading": "$"+(data?.data?.price  * userBalance).toFixed(2)}</Text>
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
                                bgGradient="linear(to-t, yellow.300, blue.500)"
                                
                            >
                            <Flex p="1em" color="#fff" flexDir="column" h="100%" justify="space-between" >
                                <Flex justify="space-between" w="100%" align="flex-start">
                                    <Flex flexDir="column">
                                        <Text color="gray.400">Current Balance</Text>
                                        <Text fontWeight="bold" fontSize="xl">$15,250.20</Text>
                                    </Flex>
                                    <Flex align="center">
                                        <Icon mr={2} as={FiCreditCard} />
                                        <Text>Mila.</Text>
                                    </Flex>
                                </Flex>
                                <Text mb={4}>**** **** **** 1289</Text>
                                <Flex align="flex-end" justify="space-between">
                                    <Flex>
                                        <Flex flexDir="column" mr={4}>
                                            <Text textTransform="uppercase" fontSize="xs">Valid Thru</Text>
                                            <Text fontSize="lg">12/23</Text>
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
                                        <Text color="gray.400">Current Balance</Text>
                                        <Text fontWeight="bold" fontSize="xl">$9,950.20</Text>
                                    </Flex>
                                    <Flex align="center">
                                        <Icon mr={2} as={FiCreditCard} />
                                        <Text>Mila.</Text>
                                    </Flex>
                                </Flex>
                                <Text mb={4}>**** **** **** 1289</Text>
                                <Flex align="flex-end" justify="space-between">
                                    <Flex>
                                        <Flex flexDir="column" mr={4}>
                                            <Text textTransform="uppercase" fontSize="xs">Valid Thru</Text>
                                            <Text fontSize="lg">12/23</Text>
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
                    
                   
                        
                    {swap == "fromto" &&
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
                    {swap === "tofrom" &&
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
                    <Heading fontWeight="normal">Welcome back, <Flex fontWeight="bold" display="inline-flex">Ola Silva A.</Flex></Heading>
                    <Text color="gray" fontSize="sm">My Balance</Text>
                    <Text fontWeight="bold" fontSize="2xl">Connect Wallet</Text>
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




