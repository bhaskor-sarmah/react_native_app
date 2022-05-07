import { db, auth} from "./firebaseConfig.js";

import {
    collection, getDocs,
    addDoc, doc, deleteDoc, onSnapshot, query, where,
    orderBy, getDoc, updateDoc,
    serverTimestamp,
    setDoc
} from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

// One Time Collection Data
const getAllDocuments = (collectionName) => {
    return new Promise((resolve, reject) => {
        try {
            const collectionRef = collection(db, collectionName);
            getDocs(collectionRef)
                .then((snapshot) => {
                    let results = [];
                    snapshot.docs.forEach((snap) => {
                        results.push({ ...snap.data(), id: snap.id });
                    });
                    resolve(results);
                }).catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
};


const addNewDocument = (collectionName, dataToSave) => {
    return new Promise((resolve, reject) => {
        try {
            const collectionRef = collection(db, collectionName);
            // Adding a createdAt field
            dataToSave.createdAt = serverTimestamp();
            addDoc(collectionRef, dataToSave)
                .then((result) => {
                    resolve(result.id);
                }).catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}


const addNewDocumentWithId = (collectionName, dataToSave, documentId) => {
    console.log(documentId);
    return new Promise((resolve, reject) => {
        try {
            // const collectionRef = collection(db, collectionName);
            
            const documentRef = doc(db, collectionName, documentId.toString());

            // Adding a createdAt field
            dataToSave.createdAt = serverTimestamp();
            setDoc(documentRef, dataToSave)
                .then((result) => {
                    resolve(result);
                }).catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

const deleteDocumentById = (collectionName, documentId) => {
    return new Promise((resolve, reject) => {
        try {
            const documentRef = doc(db, collectionName, documentId)
            deleteDoc(documentRef)
                .then(() => {
                    resolve({ id: documentId });
                }).catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

// Queries
// We can use orderBy() as a third param to the query() method or
// as a second param to the query() method if we don't need any where() method
// the orderBy() method will take two param, i.e the field and the order ('asc', 'desc')
// we can skip the second param to make is 'asc' by default
// So, we can create the query param as per our requirement, also please note that to use
// a field in orderBy we need to create a index in the firestore for the field.
const getDocByQuery = (collectionName, queryParam) => {
    let field = queryParam.field;
    let operator = queryParam.operator;
    let value = queryParam.value;
    return new Promise((resolve, reject) => {
        try {
            const collectionRef = collection(db, collectionName);
            const queryRef = query(collectionRef, where(field, operator, value));
            onSnapshot(queryRef, (snapshot) => {
                let results = [];
                snapshot.docs.forEach((snap) => {
                    results.push({ ...snap.data(), id: snap.id });
                });
                console.log(results);
                resolve(results);
            })
        } catch (error) {
            reject(error);
        }
    });
}

const getDocumentById = (collectionName, documentId) => {
    return new Promise((resolve, reject) => {
        try {
            const documentRef = doc(db, collectionName, documentId)
            getDoc(documentRef).then((snapshot) => {
                resolve({ ...snapshot.data(), id: snapshot.id });
            }).catch((error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}



// Update the specific field that we pass to as newData
const updateDocumentById = (collectionName, documentId, newData) => {
    return new Promise((resolve, reject) => {
        try {
            const documentRef = doc(db, collectionName, documentId)
            updateDoc(documentRef, newData).then((snapshot) => {
                resolve({ id: documentId });
            }).catch((error) => {
                reject(error);
            })
        } catch (error) {
            reject(error);
        }
    });
}

/*********************************
 ********* FIREBASE AUTH *********
 ********************************/

const addNewUser = (email, password) => {
    return new Promise((resolve, reject) => {
        try {
            createUserWithEmailAndPassword(auth, email, password).then((cred) => {
                console.log(cred.user);
                resolve(cred.user);
            }).catch((error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}

const logIn = (email, password) => {
    return new Promise((resolve, reject) => {
        try {
            signInWithEmailAndPassword(auth, email, password).then((cred) => {
                resolve(cred.user);
            }).catch((error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });

}

const logOut = () => {
    return new Promise((resolve, reject) => {
        try {
            signOut(auth).then(() => {
                resolve({ message: "Signed Out Sucessfully !" })
            }).catch((error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}


/************************************************************
 ********* FIREBASE SUBSCRIPTION AND UNSUBSCRIPTION *********
 ************************************************************/

// Subscribing to user log in or log out, So, that we can
// fire a custom function each time a user signed In or Signed Out
// const unsubAuth = onAuthStateChanged(auth, (user) => {
//     console.log("User Status Changed : " + user);
// });

// Real Time Subscription to collection data
// const collectionName = "test";
// const collectionRef = collection(db, collectionName);
// const unsubCollection = onSnapshot(collectionRef, (snapshot) => {
//     let results = [];
//     snapshot.docs.forEach((snap) => {
//         results.push({ ...snap.data(), id: snap.id });
//     });
//     console.log(results);
// });


// We can subscribe to a document, it doesn't return a Promise so we
// need to update the state
// const documentId = "dBvr7iNN7NTyTSNYBT62";
// const documentRef = doc(db, collectionName, documentId)
// const unsubDocument = onSnapshot(documentRef, (snapshot) => {
//     console.log({ ...snapshot.data(), id: snapshot.id });
// });


// Unsubscribe from subscriptions
// We have three subscriptions => Collection, Document , Auth
// const unsubscribeFromSubscription = () => {
//     return new Promise((resolve, reject) => {
//         try {
//             console.log("Unsubscribing");
//             unsubCollection();
//             unsubDocument();
//             unsubAuth();
//             resolve();
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

export const firebaseServices = {
    getAllDocuments,
    addNewDocument,
    deleteDocumentById,
    getDocByQuery,
    getDocumentById,
    updateDocumentById,
    addNewUser,
    logIn,
    logOut,
    addNewDocumentWithId
    // unsubscribeFromSubscription
}