const { createApp, ref } = Vue

const app = createApp({
    setup() {
        const newItem = ref(false)
        const editItem = ref(false)
        const id = ref(0)
        const name = ref('')
        const nameEdited = ref('')
        const priority = ref('')
        const priorityEdited = ref('')
        const priorityTypes = ref(['LOW', 'MEDIUM', 'HIGH'])
        const description = ref('')
        const descriptionEdited = ref('')
        const list = ref([])
        const toast = PrimeVue.useToast()
        const confirm = PrimeVue.useConfirm()
        const hasErrors = ref(false)
        const save = () => {
            if(name.value === "" || priority.value === null || description.value === '') {
                hasErrors.value = true
            }
            else {
                const storage = localStorage.getItem("list")
                let index = 1
                if(storage !== null) {                    
                    index = JSON.parse(storage).length + 1
                }
                const item = {
                    id: index,
                    name: name.value,
                    priority: priority.value,
                    description: description.value
                }
                list.value.push(item)
                localStorage.setItem("list", JSON.stringify(list.value))
                toast.add({ severity: "success", summary: "Message", detail: "Item was saved successfully", life: 3000 })
                clearNewItem()
            }
        }
        const edit = itemId => {
            editItem.value = true
            const editedItem = list.value.find((item) => item.id === itemId)
            id.value = itemId
            nameEdited.value = editedItem.name
            priorityEdited.value = editedItem.priority
            descriptionEdited.value = editedItem.description
        }
        const update = () => {
            if(nameEdited.value === "" || priorityEdited.value === '' || descriptionEdited.value === '') {
                hasErrors.value = true
            }
            else {
                list.value.map(item => {
                    if(item.id === id.value) {
                        item.name = nameEdited.value
                        item.priority = priorityEdited.value
                        item.description = descriptionEdited.value
                        localStorage.setItem("list", JSON.stringify(list.value))
                        toast.add({ severity: "info", summary: "Message", detail: "Item was updated successfully", life: 3000 })
                        clearEditItem()
                    }
                })
            }
        }
        const deleteItem = id => {
            confirm.require({
                message: 'Do you really want to delete this item?',
                header: 'Delete Item',
                icon: 'pi pi-info-circle',
                rejectLabel: 'Cancel',
                acceptLabel: 'Delete',
                rejectClass: 'p-button-secondary p-button-outlined',
                acceptClass: 'p-button-danger',
                accept: () => {
                    list.value = list.value.filter(item => item.id !== id)
                    localStorage.setItem("list", JSON.stringify(list.value))
                    toast.add({ severity: "error", summary: "Message", detail: "Item was deleted successfully", life: 3000 })
                }
            })
        }
        const clearNewItem = () => {
            name.value = ''
            priority.value = null
            description.value = ''
            newItem.value = false
            hasErrors.value = false
        }
        const clearEditItem = () => {
            nameEdited.value = ''
            priorityEdited.value = null
            descriptionEdited.value = ''
            editItem.value = false
            hasErrors.value = false
        }
        return {
            newItem, editItem, id, name, nameEdited, priority, priorityEdited, priorityTypes, description, descriptionEdited, 
            list, toast, confirm, hasErrors, save, edit, update, deleteItem, clearNewItem, clearEditItem
        }
    },
    mounted() {
        const storage = localStorage.getItem("list")
        if(storage !== null) {
            this.list = JSON.parse(storage)
        }
    }
})

app.use(PrimeVue.Config, {
    theme: {
        preset: PrimeVue.Themes.Aura
    }
})
app.use(PrimeVue.ToastService)
app.use(PrimeVue.UseConfirm)
app.use(PrimeVue.ConfirmationService)

app.component("p-panel", PrimeVue.Panel)
app.component("p-button", PrimeVue.Button)
app.component("p-dialog", PrimeVue.Dialog)
app.component("p-inputtext", PrimeVue.InputText)
app.component("p-textarea", PrimeVue.Textarea)
app.component("p-select", PrimeVue.Select)
app.component("p-message", PrimeVue.Message)
app.component("p-toast", PrimeVue.Toast)
app.component("p-confirmdialog", PrimeVue.ConfirmDialog)
app.component("p-datatable", PrimeVue.DataTable)
app.component("p-column", PrimeVue.Column)

app.mount("#app")