document.addEventListener("DOMContentLoaded", function() {

    getBooks()

});


function getBooks(){
    fetch("http://localhost:3000/books")
    .then(res=> res.json())
    .then(books=> appendBooks(books))
}

function appendBooks(books){
    let ul = document.getElementById("list")
    books.forEach(book=> {
        
        let li = document.createElement("li")
    
        li.textContent = book.title

        ul.append(li)

    })

    addClickEventListeners(books)
}


function addClickEventListeners(books){
    let booksLis = document.getElementsByTagName("li")
    for (bookLi of booksLis){
        bookLi.addEventListener("click", (event)=>{
            showBook(books, event)
        })
    }
}

function showBook(books, event){
    let showPanel = document.getElementById("show-panel")
    let clickedBook = event.target.textContent
    let bookObj = books.find(eachBook=>eachBook.title === clickedBook)
    let usersArr = bookObj.users
    
    showPanel.innerHTML= ""
    

    let bookImg = document.createElement("img")
    let bookTitle = document.createElement("h2")
    let bookSubTitle= document.createElement("h2")
    let bookAut = document.createElement("h2")
    let bookDes = document.createElement("p")
    let likeBtn = document.createElement('button')
    let usersList = document.createElement('ul')

    bookImg.src = bookObj.img_url
    bookTitle.textContent = bookObj.title
    bookSubTitle.textContent= bookObj.subtitle 
    bookAut.textContent= bookObj.author
    bookDes.textContent = bookObj.description

    if (bookObj.users.find(user=> user.username === "pouros") === undefined){
        likeBtn.textContent = "LIKE"
    }

    else {
        likeBtn.textContent = "UNLIKE"
    }
    

    usersList.id = "users-list"
    likeBtn.id = "like-button"

    showPanel.append(bookImg, bookTitle, bookSubTitle, bookAut, bookDes, usersList, likeBtn)

    for (user of usersArr){
        let li = document.createElement('li')
        li.textContent = user.username
        usersList.append(li)
    }

    likeBtn.addEventListener("click", ()=>{

        if (likeBtn.textContent === "LIKE"){
            handleLike(bookObj, likeBtn)
        }

        else {
            handleUnlike(bookObj, likeBtn)
        }
    })

}

function handleUnlike(bookObj, likeBtn){
    likeBtn.textContent = "LIKE"

    let newArr = bookObj.users

    let userLi= document.getElementById("current-user")

    userLi.remove()

    fetch(`http://localhost:3000/books/${bookObj.id}`,{
        method: "PATCH",
        body: JSON.stringify({
            users: newArr

        }),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(res=>res.json())
    .then(book => console.log(book))

}

function handleLike(bookObj, likeBtn){

    likeBtn.textContent = "UNLIKE"

    
    let users = bookObj.users
    let currentUser = {
        "id":1, 
        "username":"pouros"
    }

    let newArr = [...users, currentUser]

    console.log(newArr)

    fetch(`http://localhost:3000/books/${bookObj.id}`,{
        method: "PATCH",
        body: JSON.stringify({
            users: newArr

        }),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(res=>res.json())
    .then(book => console.log(book))

    appendUser(currentUser)

        
}

function appendUser(currentUser){
    let usersList = document.getElementById("users-list")

    let li = document.createElement("li")

    li.id = "current-user"

    li.textContent = currentUser.username

    usersList.append(li)
}
