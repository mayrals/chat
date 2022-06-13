



console.log('funcionando')



const btnIngreso = document.querySelector('#btnIngreso')
const btnCerrarSesion = document.querySelector('#btnCerrarSesion')
const contenidoWeb = document.querySelector('#contenidoWeb')
const nombreUsuario = document.querySelector('#nombreUsuario')
const formulario = document.querySelector('#formulario')
const texto = document.querySelector('#texto')



/*import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();
firebase.auth().onAuthStateChanged(auth, (user) => {*/
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        contenidoWeb.innerHTML = ''
        console.log(user)
        accionCerrarSesion()
        nombreUsuario.innerHTML = user.displayName
        contenidoChat(user)
        
        // ...
    } else {

        accionAcceder()
        nombreUsuario.innerHTML = 'BChat'
        contenidoWeb.innerHTML = `<p class="lead mt-5 text-center"> Debes iniciar sesion </p>
        `
    }
});
const contenidoChat = user => {
    formulario.addEventListener('submit', e => {
        e.preventDefault()
        console.log(texto.value)
        if(!texto.value.trim()){
            console.log('texto vacio')
            return
        }
        firebase.firestore().collection('chat').add({
            texto: texto.value,
            uid: user.uid,
            fecha: Date.now()
        }).then(res => {
            console.log('texto agregado a firestore')
        })
        texto.value = ''
    })


    firebase.firestore().collection("chat").orderBy('fecha')
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                console.log("Agrega chat: ", change.doc.data());

                if(user.uid === change.doc.data().uid){
                    contenidoWeb.innerHTML += `
                    <div class="text-end">
                    <span class="badge bg-info">${change.doc.data().texto}</span>
                </div>
                    `
                }else {
                    contenidoWeb.innerHTML += `
                    <div class="text-start">
            <span class="badge bg-secondary">${change.doc.data().texto}</span>
        </div>
                    `

                }
              
                contenidoWeb.scrollTop = contenidoWeb.scrollHeight


            }
           /* if (change.type === "modified") {
                console.log("Modified chat: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed chat: ", change.doc.data());
            } */
        });
    });


}

const accionAcceder = () => {
    console.log('sin registro')
    formulario.classList.add('d-none')
   

    btnIngreso.addEventListener('click', async() =>{
        console.log('quieres iniciar sesion')
        const provider = new firebase.auth.GoogleAuthProvider();
        try{
            await firebase.auth().signInWithPopup(provider)
        } catch (error){
            console.log(error)
        }

    })
}

const accionCerrarSesion = () => {
    console.log('registrado')
    formulario.classList.remove('d-none')
    btnCerrarSesion.addEventListener('click', () => {
        console.log('diste click en cerrar sesion')
        firebase.auth().signOut()
    })
}