connection = Mongo('mongodb://127.0.0.1:27017/?readPreference=primary&directConnection=true&ssl=false');
db = connection.getDB('balance-statistic');
db.createCollection('user', {
    validator: {
        $jsonSchema: {
            required: ['name', 'email', 'password'],
            properties: {
                name: {
                    bsonType: 'string'
                },
                email: {
                    bsonType: 'string'
                },
                password: {
                    bsonType: 'string'
                },
                session: {
                    bsonType: 'object',
                    properties: {
                        token: {
                            bsonType: 'string'
                        },
                        expires: {
                            bsonType: 'date'
                        }
                    }
                },
                accounts: {
                    bsonType: 'array',
                    items: {
                        bsonType: 'object',
                        properties: {
                            accountId: {
                                bsonType: 'objectId'
                            },
                            sumSelect: {
                                bsonType: 'bool'
                            }
                        }
                    }
                },
                savingGoals: {
                    bsonType: 'array',
                    items: {
                        bsonType: 'objectId'
                    }
                },
                budget: {
                    bsonType: 'object',
                    properties: {
                        savingRate: {
                            bsonType: 'number'
                        },
                        budget: {
                            bsonType: 'number'
                        },
                        earnings: {
                            bsonType: 'number'
                        },
                        expenses: {
                            bsonType: 'number'
                        }
                    }
                }
            }
        }
    },
    validationLevel: 'strict',
    validationAction: 'warn'
});

db.createCollection('account', {
    validator: {
        $jsonSchema: {
            required: ['name', 'balance', 'type', 'currency', 'access'],
            properties: {
                access: {
                    bsonType: 'object',
                    properties: {
                        owner: {
                            bsonType: 'objectId'
                        },
                        subscribers: {
                            bsonType: 'array',
                            items: {
                                bsonType: 'objectId'
                            }
                        }
                    }
                },
                name: {
                    bsonType: 'string'
                },
                number: {
                    bsonType: 'string'
                },
                provider: {
                    bsonType: 'string'
                },
                balance: {
                    bsonType: 'number'
                },
                type: {
                    bsonType: 'string'
                },
                currency: {
                    bsonType: 'string'
                }
            }
        }
    },
    validationLevel: 'strict',
    validationAction: 'warn'
});

db.createCollection('savingGoal', {
    validator: {
        $jsonSchema: {
            required: ['name', 'total', 'current', 'access', 'category', 'accountId', 'startDate'],
            properties: {
                name: {
                    bsonType: 'string'
                },
                description: {
                    bsonType: 'string'
                },
                total: {
                    bsonType: 'number'
                },
                current: {
                    bsonType: 'number'
                },
                startDate: {
                    bsonType: 'date'
                },
                endDate: {
                    bsonType: 'date'
                },
                category: {
                    bsonType: 'string'
                },
                access: {
                    bsonType: 'object',
                    properties: {
                        owner: {
                            bsonType: 'objectId'
                        },
                        contributors: {
                            bsonType: 'array',
                            items: {
                                bsonType: 'object',
                                properties: {
                                    userId: {
                                        bsonType: 'objectId'
                                    },
                                    rate: {
                                        bsonType: 'number'
                                    }
                                }
                            }
                        }
                    }
                },
                account: {
                    bsonType: 'objectId'
                }
            }
        }
    },
    validationLevel: 'strict',
    validationAction: 'warn'
});

db.createCollection('transaction', {
    validator: {
        $jsonSchema: {
            required: ['sender', 'receiver.receiverId', 'amount', 'timestamp', 'type'],
            properties: {
                amount: {
                    bsonType: 'number'
                },
                type: {
                    bsonType: 'string'
                },
                category: {
                    bsonType: 'string'
                },
                timestamp: {
                    bsonType: 'date'
                },
                description: {
                    bsonType: 'string'
                },
                sender: {
                    bsonType: 'object',
                    properties: {
                        senderId: {
                            bsonType: 'objectId'
                        },
                        senderAccount: {
                            bsonType: 'objectId'
                        }
                    }
                },
                receiver: {
                    bsonType: 'object',
                    properties: {
                        receiverId: {
                            bsonType: 'objectId'
                        },
                        receiverAccount: {
                            bsonType: 'objectId'
                        }
                    }
                },
                recurrenceId: {
                    bsonType: 'objectId'
                },
                owner: {
                    bsonType: 'objectId'
                }
            }
        }
    },
    validationLevel: 'strict',
    validationAction: 'warn'
});

db.createCollection('recurrence', {
    $jsonSchema: {
        required: ['name', 'creationDate', 'occurrence', 'sender', 'receiver.receiverId', 'amount'],
        properties: {
            name: {
                bsonType: 'string'
            },
            description: {
                bsonType: 'string'
            },
            creationDate: {
                bsonType: 'date'
            },
            occurrence: {
                bsonType: 'string'
            },
            category: {
                bsonType: 'string'
            },
            sender: {
                bsonType: 'object',
                properties: {
                    senderId: {
                        bsonType: 'objectId'
                    },
                    senderAccount: {
                        bsonType: 'objectId'
                    }
                }
            },
            receiver: {
                bsonType: 'object',
                properties: {
                    receiverId: {
                        bsonType: 'objectId'
                    },
                    receiverAccount: {
                        bsonType: 'objectId'
                    }
                }
            },
            amount: {
                bsonType: 'number'
            }
        }
    },
    validationLevel: 'strict',
    validationAction: 'warn'
});
