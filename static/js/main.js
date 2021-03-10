// Selecting buttons for doing stuff
const btnLeftSection1 = document.querySelector("#btn-left-section-1");
const btnLeftSection2 = document.querySelector("#btn-left-section-2");
const btnLeftSection3 = document.querySelector("#btn-left-section-3");
const btnLeftSection4 = document.querySelector("#btn-left-section-4");
let ZIndex = 2;
// Selecting sections for adding and removing
const rightSection1 = document.querySelector(".right-section-1");
const rightSection2 = document.querySelector(".right-section-2");
const rightSection3 = document.querySelector(".right-section-3");
const rightSection4 = document.querySelector(".right-section-4");

btnLeftSection1.addEventListener("click", function() {
    console.log("I am section One");
    rightSection1.style.zIndex = ZIndex;
    ZIndex = ZIndex + 1;
});

function refreshSectionTwo() {

    let xhttp = new XMLHttpRequest();

    let linksToRemoveWrapper = document.querySelector(".links-to-remove-wrapper");

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            let responseTextFromServer = JSON.parse(this.responseText);

            linksToRemoveWrapper.innerHTML = "";
            let form = document.createElement("form");
            form.className = "formInsideLinksToRemoveWrapper";
            for (const key in responseTextFromServer) {
                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = key;
                checkbox.className = "checkbox";
                let label = document.createElement("label");
                label.innerText = responseTextFromServer[key];
                label.className = "label";
                form.appendChild(checkbox);
                form.appendChild(label);
                form.appendChild(document.createElement("br"));
                linksToRemoveWrapper.appendChild(form);
            }
        }
    };
    xhttp.open("GET", '/hosts', true);
    xhttp.send();
}

btnLeftSection2.addEventListener("click", function() {
    console.log("I am section Two");
    rightSection2.style.zIndex = ZIndex;
    ZIndex = ZIndex + 1;

    // // Getting links already blocked in hosts file
    // let xhttp = new XMLHttpRequest();

    // let linksToRemoveWrapper = document.querySelector(".links-to-remove-wrapper");

    // xhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         console.log(this.responseText);
    //         let responseTextFromServer = JSON.parse(this.responseText);

    //         linksToRemoveWrapper.innerHTML = "";
    //         let form = document.createElement("form");
    //         form.className = "formInsideLinksToRemoveWrapper";
    //         for (const key in responseTextFromServer) {
    //             let checkbox = document.createElement("input");
    //             checkbox.type = "checkbox";
    //             checkbox.value = key;
    //             checkbox.className = "checkbox";
    //             let label = document.createElement("label");
    //             label.innerText = responseTextFromServer[key];
    //             label.className = "label";
    //             form.appendChild(checkbox);
    //             form.appendChild(label);
    //             form.appendChild(document.createElement("br"));
    //             linksToRemoveWrapper.appendChild(form);
    //         }
    //     }
    // };
    // xhttp.open("GET", '/hosts', true);
    // xhttp.send();
    refreshSectionTwo();

});



btnLeftSection3.addEventListener("click", function() {
    console.log("I am section Three");
    rightSection3.style.zIndex = ZIndex;
    ZIndex = ZIndex + 1;
});


btnLeftSection4.addEventListener("click", function() {
    console.log("I am section Four");
    rightSection4.style.zIndex = ZIndex;
    ZIndex = ZIndex + 1;
});


// Function to validate link
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}


// Function to extract domain from url
function URL2Domain(url) {
    return url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
}


// Fetching value from right-section-1
// and handling appending of links into host file
const btnInsideRightSection1 = document.querySelector(".right-section-1 button");
const resultInsideRightSection1 = document.querySelector(".result");


btnInsideRightSection1.addEventListener("click", () => {

    let inputInsideRightSection1 = document.querySelector(".right-section-1 input");
    let urlToBlock = URL2Domain(inputInsideRightSection1.value);



    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            resultInsideRightSection1.innerHTML = this.responseText;
        }
    };
    if (validURL(urlToBlock)) {
        xhttp.open("GET", `/add?url=${urlToBlock}`, true);
        xhttp.send();
    } else {
        resultInsideRightSection1.innerHTML = "<span>Please enter a valid Url.</span>";
    }
});


// fetching links from user to delete from the hosts file
function getCheckedLinks() {
    let checkedLinks = [];
    let checkboxInsideFormInsideLinksToRemove = document.querySelectorAll(".checkbox");

    for (let i = 0; i < checkboxInsideFormInsideLinksToRemove.length; i++) {
        if (checkboxInsideFormInsideLinksToRemove[i].checked === true) {
            checkedLinks.push(checkboxInsideFormInsideLinksToRemove[i].value)
        } else {
            continue;
        }
    }
    return checkedLinks;
}

const buttonInsideSection2 = document.querySelector(".buttonInsideSection2");

buttonInsideSection2.addEventListener("click", function() {

    let xhttp = new XMLHttpRequest();

    let checkBoxesChecked = []
    let checkboxList = document.querySelectorAll(".checkbox");

    for (let i = 0; i < checkboxList.length; i++) {
        if (checkboxList[i].checked === true) {
            checkBoxesChecked.push(i);
        }
    }
    // console.log(checkBoxesChecked);

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText === "Site  successfully removed from blocked list") {
                alert(this.responseText);
                refreshSectionTwo();
            } else {
                alert("site unblocking failed");
            }
        }
    };

    xhttp.open("GET", `/remove?list=${checkBoxesChecked.join(':')}`, true);
    xhttp.send();
});