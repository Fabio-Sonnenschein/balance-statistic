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
                    bsonType: 'objectId'
                },
                savingGoals: {
                    bsonType: 'objectId'
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

db.createCollection('account', {
    validator: {
        $jsonSchema: {
            required: ['name', 'balance', 'type'],
            properties: {
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
            required: ['name', 'total', 'rate', 'type'],
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
                endDate: {
                    bsonType: 'date'
                },
                type: {
                    bsonType: 'string'
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