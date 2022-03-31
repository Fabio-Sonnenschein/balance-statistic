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
                            number: {
                                bsonType: 'string'
                            },
                            balance: {
                                bsonType: 'number'
                            },
                            provider: {
                                bsonType: 'string'
                            },
                            type: {
                                bsonType: 'string'
                            }
                        }
                    }
                },
                savingGoals: {
                    bsonType: 'object',
                    properties: {
                        name: {
                            bsonType: 'string'
                        },
                        total: {
                            bsonType: 'number'
                        },
                        current: {
                            bsonType: 'number'
                        },
                        rate: {
                            bsonType: 'number'
                        },
                        startDate: {
                            bsonType: 'date'
                        },
                        completionDate: {
                            bsonType: 'date'
                        }
                    }
                },
                budget: {
                    bsonType: 'object',
                    properties: {
                        savingrate: {
                            bsonType: 'number'
                        },
                        budget: {
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
db.createCollection('transaction', {
    validator: {
        $jsonSchema: {
            required: ['sender', 'receiver', 'amount'],
            properties: {
                sender: {
                    bsonType: 'objectId'
                },
                receiver: {
                    bsonType: 'objectId'
                },
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
                }
            }
        }
    },
    validationLevel: 'strict',
    validationAction: 'warn'
});