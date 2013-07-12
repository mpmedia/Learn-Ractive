var TodoList = Ractive.extend({
  template: template,

  partials: {}, // add the 'item' partial

  addItem: function ( description ) {
    this.items.push({
      description: description,
      done: false
    });
  },

  removeItem: function ( index ) {
  	this.items.splice( index, 1 );
  },

  editItem: function ( index ) {
    var self = this, keydownHandler, blurHandler, input, currentDescription;

    currentDescription = this.get( 'items.' + index + '.description' );
    this.set( 'items.' + index + '.editing', true );

    input = this.nodes.editTodo;
    input.select();

    window.addEventListener( 'keydown', keydownHandler = function ( event ) {
      switch ( event.which ) {
        case 13: // ENTER
        input.blur();
        break;

        case 27: // ESCAPE
        input.value = currentDescription;
        self.set( 'items.' + index + '.description', currentDescription );
        input.blur();
        break;

        case 9: // TAB
        event.preventDefault();
        input.blur();
        self.editItem( ( index + 1 ) % self.get( 'items' ).length );
        break;
      }
    });

    input.addEventListener( 'blur', blurHandler = function () {
      window.removeEventListener( 'keydown', keydownHandler );
      input.removeEventListener( 'blur', blurHandler );
    });
    
    this.set( 'items.' + index + '.editing', true );
  },

  init: function ( options ) {
    var self = this;

    this.items = options.items;

    // initialise
    this.set( 'items', this.items );

    // proxy event handlers
    this.on({
      remove: function ( event ) {
        this.removeItem( event.index.i );
      },
      newTodo: function ( event ) {
        this.addItem( event.node.value );
        event.node.value = '';
      },
      edit: function ( event ) {
        this.editItem( event.index.i );
      },
      stop_editing: function ( event ) {
        this.set( event.keypath + '.editing', false );
      }
    });
  }
});

var ractive = new TodoList({
  el: output,
  items: [
    { done: true,  description: 'Add a todo item' },
    { done: false, description: 'Add some more todo items' },
    { done: false, description: 'Complete all the Ractive tutorials' }
  ]
});