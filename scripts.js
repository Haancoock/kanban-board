window.addEventListener('load', function(){
  //Регестрируется пользовательская деректива из подключенной библиотеки для удобной работы со списками 
  Vue.directive( 'sortable', {
  inserted: function(el, binding) {
    var sortable = new Sortable(el, binding.value || {});
  },
  
})

// Компонент для создания новой карточки
Vue.component('card-new',{
  template:'#card-new-template',
  props:['item'],
  data(){
    return {
      form: {
        text: '',
        list: '',        
      },
      isFormShowing: false 
    }
  },
  computed: {
  },
  methods: {
    handleNew(){
      this.form.text = this.item.text
      this.form.list = this.item.list
      this.isFormShowing = true
    },
    cancelForm() {
      this.clearForm()
      this.$emit('form-cancelled')
      this.isFormShowing = false 
    },
    clearForm() {
      this.form.text = '';
      this.form.list = '';
    },
    save(){
      let min = 1000
      let max = 5000
      let id = Math.floor(Math.random() * (max - min + 1)) + min
      let item = { id: id, text: this.form.text, list: this.form.list }
      this.$emit('item-created',item)
      this.clearForm()
      this.isFormShowing = false 
    },
    cancel(){
      this.$emit('item-cancelled')
      this.clearForm()
      this.isFormShowing = false 
    }
  }
})

// Компонент для редактирования уже созданных карточек
Vue.component('card-edit',{
  template:'#card-edit-template',
  props:['item'],
  data(){
    return {
      form: {
        id: '',
        text: '',
        list: '',        
      },
      isEditing: false 
    }
  },
  computed: {
  },
  methods: {
    handleEdit(){
      this.form.id = this.item.id
      this.form.text = this.item.text
      this.form.list = this.item.list
      this.isEditing = true
    },
    cancelForm() {
      this.clearForm()
      this.$emit('form-cancelled')
    },
    clearForm() {
      this.form.id = '';
      this.form.text = '';
      this.form.list = '';
    },
    save(){
      let item = {id: this.form.id, text: this.form.text, list: this.form.list}
      this.$emit('item-edited',item)
      this.clearForm()
      this.isEditing = false 
    },
    cancel(){
      this.$emit('item-cancelled')
      this.clearForm()
      this.isEditing = false 
    }
  }
  
})

//Компонент отвечающий за вывод каждой доски и переданных карточек
Vue.component('list',{
  
  template: '#list-template',
  
  props:[ 'list_name','list_description',
            'lists','list_items',
            'item_text','header_color'],
    
  data() {
      return {
        editItem:null,
        showForm:false,
      }
  },
  
  computed: {

    filteredListItems(){
      
        return this.list_items.filter(t => { return t.list == this.list_name })
      
    },
    
    defaultItem(){
      
        return { id: 0, text: this.item_text, list: this.list_name }
      
    },
    sortableConfig(){
      
      return  { 
                  onAdd: this.putItem,
                  draggable: '.draggable-card',  
                  group: { name: this.list_name, put: this.list_put }
                }
      
    }
  },
  
  methods: {
    
    list_put() {
      
        return this.lists.filter(t => t !== this.list_name )
      
    },
    
    putItem(evt){
      
      let idx = _.findIndex(this.list_items, t => t.id == evt.item.id)
      let item = this.list_items[idx]
      item.list = evt.to.dataset.type
      this.list_items.splice(idx, 1, item)
      
    },
    
    showEditForm(item){
      this.editItem = item
      this.showForm = true
    },
    
    showNewForm() {
      this.editItem = null
      this.showForm = true;
    },
    
    closeForm(){
      this.showForm = false;
    },
    
    itemCreated(item){
      this.list_items.push(item)
      this.closeForm()
    },
    
    itemEdited(item){
      console.log(item)
      let idx = _.findIndex(this.list_items, t => t.id == item.id)
      let itm = this.list_items[idx]
      itm.list = item.list
      itm.text = item.text
      this.list_items.splice(idx, 1, itm)
      this.closeForm()
    },
    
    itemCancelled(){
      this.closeForm()
    }
  }
})

Vue.component('board',{
  
  template:'#board-template',
  
  data(){
    
    return {
      
      lists:[
        { name:'todo',description:'Сделать',header_color:'red'},
        { name:'doing',description:'В процессе',header_color:'yellow'},
        { name: 'verify', description: 'На проверке', header_color:'blue'},
        { name:'done',description:'Выполнено',header_color:'green'},
      ],
      
      items: [
        { id: 1, text: 'Успешно устроиться на работу в "СевСтар"', list: 'verify' },
        { id: 2, text: 'Стать крутым фронтендером', list: 'todo' },
        { id: 3, text: 'Наработать больше опыта с Vue.js', list: 'doing' },
        { id: 4, text: 'Дождаться положительного ответа по тестовому заданию', list: 'doing' },
        { id: 5, text: 'Заблудиться и опоздать на интервью :)', list: 'done' },
        { id: 6, text: 'Пройти интервью', list: 'done' },
        { id: 7, text: 'Отправить тестовое задание', list: 'done' },
      ],
    }
  },  
})

new Vue({ el:'#app' })
});
