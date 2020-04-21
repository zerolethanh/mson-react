export default {
  name: 'app.EditContact',
  component: 'RecordEditor',
  baseForm: {
    component: 'Form',
    fields: [
      {
        name: 'personFullNameField',
        component: 'PersonFullNameField',
        label: 'PersonFullNameField',
        help: 'Example help',
        required: true,
      },
      {
        name: 'email',
        component: 'EmailField',
        label: 'Email',
      },
    ],
    listeners: [
      {
        event: 'load',
        actions: [
          {
            // Default the id to '1' so that we can edit the doc later. Usually, this id would come
            // from the route or the user's session
            component: 'Set',
            name: 'fields.id.value',
            value: '1',
          },
        ],
      },
    ],
  },
  label: 'Contact',
  store: {
    component: 'LocalStorageStore',
    storeName: 'contactLocalStorage',
  },
  storeWhere: {
    id: '1',
  },
};
