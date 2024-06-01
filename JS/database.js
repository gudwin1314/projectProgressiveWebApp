import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";


class EcommerceDB {
    constructor() {
        this.db = null;
        this.isAvailable = false;
    }


    open() {
        return new Promise((resolve, reject) => {
            try {
                const firebaseConfig = {
                    apiKey: "AIzaSyDpuLiGMl1YHuGzh71BAHqgKi1M0pt7lI8",
                    authDomain: "pwaproject-2b7f8.firebaseapp.com",
                    projectId: "pwaproject-2b7f8",
                    storageBucket: "pwaproject-2b7f8.appspot.com",
                    messagingSenderId: "1027354523659",
                    appId: "1:1027354523659:web:41280a3c02b837ae23af0e"
                };
                // Initialize Firebase
                const app = initializeApp(firebaseConfig);
                // console.log('DB is open.', app);
                // Initialize Cloud Firestore and get a reference to the service
                const db = getFirestore(app);
                const storage = getStorage(app);

                if (db) {
                    this.db = db;
                    this.storage = storage
                    this.isAvailable = true;
                    resolve();
                } else {
                    reject('The database is not available.')
                }
            }
            catch (error) {
                reject(error.message)
            }
        });
    }




    add(product, price, image) {
        return new Promise((resolve, reject) => {
            // console.log("error here")
            if (!this.isAvailable) {
                reject('Database not opened');
            }

            const carts = {
                product: product,
                price: price,
                quantity: 1,
                totalPrice: 0,
                productImage: image
            };
            // connects to the firease collection
            const dbCollection = collection(this.db, 'CartList');

            // Includes new object to the collections
            addDoc(dbCollection, carts)
                .then((docRef) => {
                    // console.log("Firestore add success", docRef);
                    resolve(docRef.id);
                })

                .catch((error) => {
                    reject(error.message)
                })

        });
    };


    getAll() {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened');
            }

            const dbCollection = collection(this.db, 'CartList');
            getDocs(dbCollection)
                .then((querySnapshot) => {
                    const result = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        data.id = doc.id;
                        result.push(data);
                    });
                    // console.log('Fetched data:', result); // Log fetched data
                    resolve(result);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error); // Log error
                    reject(error.message);
                });
        });
    }


    get(id) {
        // console.log('Cart List id: ', id)
    }

    update(id, quantity, price) {
        // console.log("Passed quantity: ", quantity)
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened!');
            }

            // Get the document reference using the passed id
            const docRef = doc(this.db, 'CartList', id);

            // Update the document with the new quantity
            updateDoc(docRef, {
                quantity: quantity,
                totalPrice: price
            })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error.message);
                });
        });
    }


    delete(id) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened!');
            }

            const docRef = doc(this.db, 'CartList', id);

            deleteDoc(docRef)
                .then(() => {
                    // console.log("Document deleted successfully");
                    resolve();
                })
                .catch((error) => {
                    console.error("Error deleting document:", error.message);
                    reject(error.message);
                });
        });
    }

    async uploadImageAndStoreProduct(file, productName, productPrice) {
        if (!this.isAvailable) {
            throw new Error('Database not opened!');
        }

        try {
            // Upload the new image to Firebase Storage
            const storageRef = ref(this.storage, 'fruits/' + file.name);
            const snapshot = await uploadBytes(storageRef, file);

            // Get the download URL of the uploaded image directly from the file reference
            const newDownloadURL = await getDownloadURL(snapshot.ref);

            // Generate a new product ID
            const productId = doc(collection(this.db, 'Products'));

            // Add product information to Firestore with the new image URL and generated ID
            await setDoc(productId, {
                productName: productName,
                productPrice: productPrice,
                imageUrl: newDownloadURL
            });

            // console.log('New product added with generated ID:', productId.id);
            return productId.id;
        } catch (error) {
            console.error('Error uploading product information:', error);
            throw new Error(error.message);
        }
    }

    async getAllProducts() {
        if (!this.isAvailable) {
            throw new Error('Database not opened!');
        }

        try {
            const productsRef = collection(this.db, 'Products');
            const querySnapshot = await getDocs(productsRef);

            const products = [];
            querySnapshot.forEach((doc) => {
                const productData = doc.data();
                productData.id = doc.id;
                products.push(productData);
                // console.log("This is products: ", products)
            });

            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error(error.message);
        }
    }


}

export default new EcommerceDB();