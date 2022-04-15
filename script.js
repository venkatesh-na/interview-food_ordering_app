import data from "./data.js"
const searchInput = document.querySelector(".search_container input")
const searchButton = document.querySelector(".search_container button")
const foodFilter = document.querySelector(".food_filter")
const cards = document.querySelector(".cards")
const ratingFilter = document.querySelector(".rating_filter select") 
const locationFilter = document.querySelector(".location_filter")
const totalBookmark = document.querySelector(".totalBookmark")


document.addEventListener("DOMContentLoaded",()=>{
    //change bookmark number
    totalBookmark.textContent = JSON.parse(localStorage.getItem("id")).length 
    
    //fetch
    const display = (data)=>{
        cards.innerHTML = data.map(e=>{
            const { id ,name, color, rating, address: [{city}],food } = e
            return ` <div class = "card">
            <div class="image_container" style = "background-color:${color};">
            <p id =  ${id} class = "select">&#9733;</p>
            </div>
            <div class="info_container">
            <h3>${name}</h3>
                            <p>${city}</p>
                            <p>${rating}</p>
                            <p>${food.map(e=>e).join(", ")}</p>
                        </div>
                    </div>`
        }).join("")
    }
    display(data)
    
    //bookmark
    const book = document.querySelectorAll(".image_container .select")
    JSON.parse(localStorage.getItem("id")).forEach((e,i)=>{
        book[i].classList.add("gold")
    })
    let bookId =  JSON.parse(localStorage.getItem("id"))
    book.forEach(e=>{
        e.addEventListener("click",()=>{
            e.classList.toggle("gold")
            if(bookId.includes(e.id))
            {
                bookId.splice(bookId.indexOf(e.id),1)
                bookId.sort((a,b)=>a-b)
            }
            else
            {
            bookId.push(e.id)
            bookId.sort((a,b)=>a-b)
            }
            totalBookmark.textContent = bookId.length
            localStorage.setItem("id",JSON.stringify(bookId))
        })
    })
 
    //food filteration
    let arr =[]
    data.map(e=>{
        e.food.forEach(a=>arr.push(a))
    })
    arr = ["All",...new Set(arr)]
    const selectFoods = document.createElement("select")
    selectFoods.innerHTML = arr.map(e=>`<option value = "${e}">${e}</option>`).join("")
    foodFilter.append(selectFoods)
    selectFoods.addEventListener("change",(e)=>{
        if(e.target.value == "All")
            display(data)
        else
        display(data.filter(a=>a.food.includes(e.target.value) == true))
    })
  

    //rating filter
    ratingFilter.addEventListener("change",(e)=>{
        display(data.filter(a=>a.rating >= e.target.value))
    })

    //search filteration
    let inputValue = ""
    searchInput.addEventListener("input",(e)=>{
       inputValue = e.target.value
    })
    searchButton.addEventListener("click",()=>{
        display(data.filter(e=>e.name.match(inputValue) != null))
        searchInput.value = ""
    })


    //location filter
    let locationArr = []
    locationArr = ["All",...new Set(data.map(e=>e.address[0].city))]
    const selectLocation = document.createElement("select")
    selectLocation.innerHTML = locationArr.map(e=>`<option value = ${e}>${e}</option>`).join("")
    
    locationFilter.appendChild(selectLocation)
    selectLocation.addEventListener("change",(e)=>{
        if(e.target.value == "All")
        {
            display(data)
        }
        else
        {
        display(data.filter(a=>a.address[0].city == e.target.value))
        }
    })
})

