const TABLES ={
    contactList: 'contactList',
    lastId: 'lastId'
}
var insertButton = document.getElementById("insert");
var cancelButton = document.getElementById("cancel");
var addButton = document.getElementById("add-button");
var contactForm = document.getElementById("contact-form");
var searchField = document.getElementById("search");
var sectionContactAdmin = document.getElementsByClassName("contact-admin")[0];
var sectionCardList = document.getElementsByClassName("card-list")[0];

cancelButton.addEventListener("click", event=>{
    event.preventDefault();
    toggleDisplay(sectionContactAdmin);
    toggleDisplay(addButton);
    cleanForm(contactForm);
});

insertButton.addEventListener("click", event=>{
    event.preventDefault();
    insertContact(contactForm);
    toggleDisplay(sectionContactAdmin);
    toggleDisplay(addButton);
    cleanForm(contactForm);
    mountList(sectionCardList);
});

addButton.addEventListener("click", (event)=>{
    event.preventDefault();
    toggleDisplay(sectionContactAdmin);
    toggleDisplay(addButton);
});

const toggleDisplay = element => element.classList.toggle('hide');

const deleteContact = id => {
    let contactList = getLocalStorage(TABLES.contactList, []);
    setLocalStorage(TABLES.contactList, contactList.filter(c=> `${c.id}` !== id))
}

const insertContact = form =>{
    let contact = new Contact();
    let contactList = getLocalStorage(TABLES.contactList, []);

    contact.name = form.name.value
    contact.phone = form.phone.value
    contact.email = form.email.value
    contact.avatarUrl = form.avatar.value

    if(form.id.value){
        contact.id = form.id.value
        contactList = contactList.filter(c=> id !== contact.id);
    }else { 
        let newId = getLocalStorage(TABLES.lastId, 0) +1;
        contact.id = `${newId}`;
        setLocalStorage(TABLES.lastId, newId);
    }

    contactList.push(contact)
    setLocalStorage(TABLES.contactList, contactList)
}

const findContactById = id =>{
    let contactList = getLocalStorage(TABLES.contactList, []);
    return contactList.find(c=> c.id === id)
}

const getLocalStorage = (name, def) =>{
    let storage = localStorage.getItem(name)
    if(!storage)
        return def
    return JSON.parse(storage)
}

const setLocalStorage = (name, obj) =>localStorage.setItem(name, JSON.stringify(obj));

const cleanForm = form =>{
    form.id.value = '';
    form.name.value = '';
    form.phone.value = '';
    form.email.value = '';
    form.avatar.value = '';
}

const fillForm = (form, contact)=>{
    form.id.value = contact.id;
    form.name.value = contact.name;
    form.phone.value = contact.phone;
    form.email.value = contact.email;
    form.avatar.value = contact.avatarUrl;
}

const filterList = ()=> {
    let list = getLocalStorage(TABLES.contactList, []);
    let search = searchField.value;
    if(!search) 
        return list;
    
    return list.filter(contact => contact.name.includes(search) || contact.email.includes(search) || contact.phone.includes(search))
}

const mountList = () =>{
    let list = filterList();
    if(!list.length){
        sectionCardList.innerHTML = '<h1>Você ainda não tem contatos cadastrados</h1>'
        return;
    }
    sectionCardList.innerHTML = list.map(contact=>`
<div class="card">
    <div class="user-card">
        <img class="avatar" src="${contact.avatarUrl}" alt="" />
        <span class="tag">${contact.name}</span>
    </div>
    <div class="general">
        <div class="more-info">
            <div class="edit-contact" value="${contact.id}">
                <div>Editar</div>
                <i class="fa fa-cog"></i>
            </div>
            <div class="remove-contact" value="${contact.id}">
                <div>Excluir</div>
                <i class="fa fa-trash"></i>
            </div>
        </div>
        <div class="normal-info">
            <div class="card-row">
                <i class="fa fa-envelope"></i>
                <span>${contact.email}</span>
            </div>
            <div class="card-row">
                <i class="fa fa-phone"></i>
                <span>${contact.phone}</span>
            </div>
            <div class="card-row">
                <i class="fa fa-info"></i>
                <span>passe o mouse para + informações</span>
            </div>
        </div>
    </div>
</div>

    `).join('')


    Object.values(document.getElementsByClassName("edit-contact")).forEach(obj=>{
        obj.addEventListener("click", event=>{
            console.log(obj.getAttribute('value'));
            fillForm(contactForm, findContactById(obj.getAttribute('value')));
            toggleDisplay(sectionContactAdmin);
            toggleDisplay(addButton);
        })
    });

    Object.values(document.getElementsByClassName("remove-contact")).forEach(obj=>{
        obj.addEventListener("click", event=>{
            deleteContact(obj.getAttribute('value'));
            mountList();
        })
    });

}

class Contact {
    constructor(){
        this.id = '';
        this.name = '';
        this.phone = '';
        this.email = '';
        this.avatarUrl = ''
    }
    // https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/44.png
}

searchField.addEventListener("keyup", mountList);

mountList();