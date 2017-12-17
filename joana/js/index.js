/*
TODO : animate things
*/
var NUMBER_OF_WORDS_IN_EXCERPT = 10;
var IMG_PLACEHOLDER = "http://placehold.it/350x350";

var ModifyRecipe = React.createClass({
  displayName: "ModifyRecipe",

  onTitleChange: function onTitleChange(event) {
    this.props.title = event.target.value;
  },
  onImgChange: function onImgChange(event) {
    this.props.img = event.target.value;
  },
  onIngredientsChange: function onIngredientsChange(event) {
    this.props.ingredients = event.target.value;
  },
  onDirectionChange: function onDirectionChange(event) {
    this.props.direction = event.target.value;
  },
  getInitialState: function getInitialState() {
    return {
      invalidFields: []
    };
  },
  onSubmit: function onSubmit(e) {
    e.preventDefault();
    var invalidFields = this.validateInput();
    if (invalidFields.length > 0) {
      //field(s) not valid, check if it's edit
      this.setState({ invalidFields: invalidFields });
    } else {
      //fields valid
      var document = JSON.parse(localStorage.getItem("document"));
      var entry = {
        title: this.props.title || "",
        img: this.props.img || "",
        ingredients: this.props.ingredients || "",
        direction: this.props.direction || ""
      };
      //field valid
      if (this.props.mode == "edit") {
        //edit mode
        document.splice(this.props.trueIdx, 1);
      }

      document.push(entry);
      document.sort(function (a, b) {
        if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
        if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
        return 0;
      });
      localStorage.setItem("document", JSON.stringify(document));
      PubSub.publish("on_modify_recipe_success", "");
    }
  },
  validateInput: function validateInput() {
    var lookup = {
      "title": "required",
      "img": "optional",
      "ingredients": "required",
      "direction": "required"
    };
    var invalidFields = [];
    for (var key in lookup) {
      if (lookup[key] == 'required' && (this.props[key] == "" || this.props[key] === undefined)) {
        invalidFields.push(key);
      }
    }
    if (invalidFields.length > 0) {
      return invalidFields;
    }
    return [];
  },
  addHasErrorClass: function addHasErrorClass(invalidFields, field, classText) {
    if (invalidFields.indexOf(field) > -1) {
      classText += " has-error";
    }
    return classText;
  },

  render: function render() {
    //add/edit mode
    var title = "Add new Recipe";
    var submitText = "Add new Recipe";
    if (this.props.mode == "edit") {
      title = "Edit Recipe";
      submitText = "Save";
    }

    //validation related
    var invalidFields = this.state.invalidFields;
    var errorText = "";
    if (invalidFields.length > 0) {
      errorText = "There are " + invalidFields.length + " error(s). Please check your input";
    }
    var titleClass = this.addHasErrorClass(invalidFields, "title", "form-group");
    var ingredientsClass = this.addHasErrorClass(invalidFields, "ingredients", "form-group");
    var directionClass = this.addHasErrorClass(invalidFields, "direction", "form-group");
    return React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "a",
        { href: "#", onClick: this.props.backButton },
        React.createElement("i", { className: "fa fa-chevron-circle-left" }),
        " Back to all recipe"
      ),
      React.createElement(
        "h1",
        null,
        title
      ),
      React.createElement(
        "span",
        { className: "error" },
        errorText
      ),
      React.createElement(
        "form",
        { onSubmit: this.onSubmit },
        React.createElement(
          "div",
          { className: titleClass },
          React.createElement(
            "label",
            null,
            "Food name"
          ),
          React.createElement("input", { defaultValue: this.props.title, onChange: this.onTitleChange, type: "text", className: "form-control", placeholder: "What's the food name?" })
        ),
        React.createElement(
          "div",
          { className: "form-group" },
          React.createElement(
            "label",
            null,
            "Food Image URL"
          ),
          React.createElement("input", { defaultValue: this.props.img, onChange: this.onImgChange, type: "text", className: "form-control", placeholder: "(Optional) Insert your food Image URL" })
        ),
        React.createElement(
          "div",
          { className: ingredientsClass },
          React.createElement(
            "label",
            null,
            "Ingredients"
          ),
          React.createElement(
            "textarea",
            { onChange: this.onIngredientsChange, className: "form-control", row: "5" },
            this.props.ingredients
          )
        ),
        React.createElement(
          "div",
          { className: directionClass },
          React.createElement(
            "label",
            null,
            "Cooking Direction"
          ),
          React.createElement(
            "textarea",
            { onChange: this.onDirectionChange, className: "form-control", row: "5" },
            this.props.direction
          )
        ),
        React.createElement(
          "button",
          { type: "submit", className: "pull-right btn btn-primary" },
          submitText
        )
      )
    );
  }
});
var HomeButton = React.createClass({
  displayName: "HomeButton",

  render: function render() {
    return React.createElement(
      "a",
      { className: "navbar-brand", href: "#", onClick: this.onHomeButtonClick },
      "RecipeBox"
    );
  },
  onHomeButtonClick: function onHomeButtonClick() {
    PubSub.publish('home_button', 'hello world!');
  }
});
var SearchBar = React.createClass({
  displayName: "SearchBar",

  onSearchbarChange: function onSearchbarChange(event) {
    PubSub.publish('on_searchbar_change', event.target.value);
  },
  render: function render() {
    return React.createElement("input", { type: "text", className: "form-control", placeholder: "Search recipe", onChange: this.onSearchbarChange });
  }
});
var RecipeDetail = React.createClass({
  displayName: "RecipeDetail",

  convertNewline2Br: function convertNewline2Br(str) {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
  },
  render: function render() {
    var imgSrc = IMG_PLACEHOLDER;
    if (this.props.img != "") {
      imgSrc = this.props.img;
    }
    return React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "a",
        { href: "#", onClick: this.props.backButton },
        React.createElement("i", { className: "fa fa-chevron-circle-left" }),
        " Back to all recipe"
      ),
      React.createElement(
        "h1",
        null,
        this.props.title
      ),
      React.createElement("img", { src: imgSrc, className: "img-thumbnail img-responsive", alt: this.props.title }),
      React.createElement(
        "h3",
        null,
        "Ingredients : "
      ),
      React.createElement("p", { dangerouslySetInnerHTML: { __html: this.convertNewline2Br(this.props.ingredients) } }),
      React.createElement(
        "h3",
        null,
        "Cooking direction :"
      ),
      React.createElement("p", { dangerouslySetInnerHTML: { __html: this.convertNewline2Br(this.props.direction) } }),
      React.createElement(
        "button",
        { onClick: this.props.editButton, className: "actionButton btn btn-primary pull-right" },
        React.createElement("i", { className: "fa fa-pencil" }),
        " Edit"
      ),
      React.createElement(
        "button",
        { onClick: this.props.deleteButton, className: "actionButton btn btn-danger pull-right" },
        React.createElement("i", { className: "fa fa-trash" }),
        " Delete"
      )
    );
  }
});
var RecipeList = React.createClass({
  displayName: "RecipeList",

  render: function render() {
    var item = this.props.item;
    var imgSrc = IMG_PLACEHOLDER;
    if (item.img != "") {
      imgSrc = item.img;
    }
    return React.createElement(
      "div",
      { className: "panel panel-default" },
      React.createElement(
        "div",
        { className: "panel-heading" },
        React.createElement(
          "h3",
          { className: "panel-title" },
          item.title,
          React.createElement(
            "a",
            { onClick: this.props.delete, className: "pull-right", href: "#" },
            React.createElement("i", { className: "fa fa-trash" })
          ),
          React.createElement(
            "a",
            { onClick: this.props.edit, className: "pull-right", href: "#" },
            React.createElement("i", { className: "fa fa-pencil" })
          )
        )
      ),
      React.createElement(
        "div",
        { className: "panel-body" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-xs-3" },
            React.createElement(
              "a",
              { onClick: this.props.readmore, href: "#" },
              React.createElement("img", { className: "img-thumbnail img-responsive", alt: item.title, src: imgSrc })
            )
          ),
          React.createElement(
            "div",
            { className: "col-xs-9" },
            React.createElement(
              "div",
              { className: "ingredients" },
              "Ingredients : ",
              this.getExcerpt(item.ingredients)
            ),
            this.getExcerpt(item.direction),
            React.createElement(
              "a",
              { onClick: this.props.readmore, className: "readMore", href: "#" },
              "Read more ",
              React.createElement("i", { className: "fa fa-chevron-circle-right" })
            )
          )
        )
      )
    );
  },
  getExcerpt: function getExcerpt(str, separator) {
    separator = separator || " ";
    var arr = str.split(separator);
    var result = "";
    for (var i = 0; i < NUMBER_OF_WORDS_IN_EXCERPT; i++) {
      if (arr[i] !== undefined) {
        result += arr[i] + separator;
      }
    }
    return result + "...";
  }
});
var App = React.createClass({
  displayName: "App",

  onReadmoreClick: function onReadmoreClick(i) {
    this.setState({
      page: "recipe_detail",
      selected_recipe_row_idx: i
    });
  },
  onBackToAllRecipeClick: function onBackToAllRecipeClick() {
    this.setState({
      page: "all_recipe",
      is_filtered: false
    });
  },
  onEditClick: function onEditClick(i) {
    this.setState({
      page: "edit_recipe",
      selected_recipe_row_idx: i
    });
  },
  onDeleteClick: function onDeleteClick(i) {
    if (confirm('Are you sure you want to delete this item?')) {
      var document = JSON.parse(this.state.document);
      var trueIdx = i;
      if (this.state.is_filtered) {
        trueIdx = this.state.updatedIndices[i];
      }
      document.splice(trueIdx, 1);
      var docStr = JSON.stringify(document);
      localStorage.setItem("document", docStr);
      this.setState({
        document: docStr,
        page: 'all_recipe',
        is_filtered: false
      });
    }
  },
  render: function render() {
    var document = JSON.parse(this.state.document);

    if (this.state.page == 'all_recipe') {
      return React.createElement(
        "div",
        { id: "wrapper" },
        document.map(function (item, i) {
          var boundReadmoreClick = this.onReadmoreClick.bind(this, i);
          var boundDeleteClick = this.onDeleteClick.bind(this, i);
          var boundEditClick = this.onEditClick.bind(this, i);
          return React.createElement(RecipeList, { "delete": boundDeleteClick, readmore: boundReadmoreClick, edit: boundEditClick, item: item, row: i });
        }, this)
      );
    } else if (this.state.page == 'filtered_recipe') {
      document = JSON.parse(this.state.updatedDocument);
      return React.createElement(
        "div",
        { id: "wrapper" },
        document.map(function (item, i) {
          var boundReadmoreClick = this.onReadmoreClick.bind(this, i);
          var boundDeleteClick = this.onDeleteClick.bind(this, i);
          return React.createElement(RecipeList, { "delete": boundDeleteClick, readmore: boundReadmoreClick, item: item, row: i });
        }, this)
      );
    } else if (this.state.page == 'add_new_recipe') {
      //new recipe page
      return React.createElement(ModifyRecipe, { backButton: this.onBackToAllRecipeClick });
    } else if (this.state.page == 'edit_recipe') {
      //edit recipe page
      var idx = this.state.selected_recipe_row_idx;
      if (this.state.is_filtered) {
        document = JSON.parse(this.state.updatedDocument);
        idx = this.state.updatedIndices[idx];
      }
      var item = document[idx];
      return React.createElement(ModifyRecipe, { mode: "edit", trueIdx: idx, title: item.title, img: item.img, ingredients: item.ingredients, direction: item.direction, backButton: this.onBackToAllRecipeClick });
    } else {
      //detail page
      var idx = this.state.selected_recipe_row_idx;
      var boundDeleteClick = this.onDeleteClick.bind(this, idx);
      var boundEditClick = this.onEditClick.bind(this, idx);
      if (this.state.is_filtered) {
        document = JSON.parse(this.state.updatedDocument);
      }
      return React.createElement(RecipeDetail, { deleteButton: boundDeleteClick, editButton: boundEditClick, backButton: this.onBackToAllRecipeClick, title: document[idx].title, ingredients: document[idx].ingredients, direction: document[idx].direction, img: document[idx].img });
    }
  },
  getInitialState: function getInitialState() {
    return {
      document: "",
      updatedDocument: "",
      updatedIndices: [], //true index for the updated document
      page: "all_recipe",
      selected_recipe_row_idx: 0,
      is_filtered: false
    };
  },
  componentWillUnmount: function componentWillUnmount() {
    PubSub.clearAllSubscriptions();
  },
  componentWillMount: function componentWillMount() {
    //subscribe to add new recipe button
    this.pubsub_token = PubSub.subscribe('new_recipe', function (msg, data) {
      this.setState({
        page: "add_new_recipe"
      });
    }.bind(this));

    //subscribe to on_modify_recipe_success
    this.pubsub_token = PubSub.subscribe('on_modify_recipe_success', function (msg, data) {
      this.setState({
        page: "all_recipe",
        document: localStorage.getItem("document")
      });
    }.bind(this));

    //subscribe to home button
    this.pubsub_token = PubSub.subscribe('home_button', function (msg, data) {
      this.setState({
        page: "all_recipe"
      });
    }.bind(this));

    //subscribe to searchbar change
    this.pubsub_token = PubSub.subscribe('on_searchbar_change', function (msg, data) {
      var document = JSON.parse(this.state.document);
      var indices = [];
      var updatedDocument = document.filter(function (item, index) {
        if (item.title.toLowerCase().search(data.toLowerCase()) !== -1) {
          indices.push(index);
          return true;
        }
        return false;
      });
      var isFiltered = false;
      if (document.length != updatedDocument.length) {
        isFiltered = true;
      }
      this.setState({
        page: "filtered_recipe",
        is_filtered: isFiltered,
        updatedDocument: JSON.stringify(updatedDocument),
        updatedIndices: indices
      });
    }.bind(this));

    //if no local storage
    if (localStorage.getItem('document') === null) {
      //initial value
      var initialDocument = [{
        title: "Apple Pie",
        img: "https://www.dropbox.com/s/x2g530jdugzhlvt/apple_pie.jpg?raw=1",
        ingredients: "a,b,c,d,e",
        direction: "Tattooed austin fixie, microdosing single-origin coffee forage thundercats whatever authentic sustainable seitan jean shorts. Authentic man braid XOXO meggings. Roof party williamsburg food truck lumbersexual iPhone. Brooklyn tumblr put a bird on it squid bicycle rights sartorial."
      }, {
        title: "Cola marinated steak",
        img: "https://www.dropbox.com/s/09mqmls8ylvphek/steak.jpg?raw=1",
        ingredients: "a,b,c,d,e",
        direction: "Tattooed austin fixie, microdosing single-origin coffee forage thundercats whatever authentic sustainable seitan jean shorts. Authentic man braid XOXO meggings. Roof party williamsburg food truck lumbersexual iPhone. Brooklyn tumblr put a bird on it squid bicycle rights sartorial."
      }, {
        title: "Spaghetti Carbonara",
        img: "https://www.dropbox.com/s/f49cemch8jlc0tq/spaghetti-carbonara.jpg?raw=1",
        ingredients: "a,b,c,d,e",
        direction: "Tattooed austin fixie, microdosing single-origin coffee forage thundercats whatever authentic sustainable seitan jean shorts. Authentic man braid XOXO meggings. Roof party williamsburg food truck lumbersexual iPhone. Brooklyn tumblr put a bird on it squid bicycle rights sartorial."
      }, {
        title: "Zuppa Soup",
        img: "",
        ingredients: "a,b,c,d,e",
        direction: "Tattooed austin fixie, microdosing single-origin coffee forage thundercats whatever authentic sustainable seitan jean shorts. Authentic man braid XOXO meggings. Roof party williamsburg food truck lumbersexual iPhone. Brooklyn tumblr put a bird on it squid bicycle rights sartorial."
      }];

      localStorage.setItem("document", JSON.stringify(initialDocument));
    }

    this.setState({ document: localStorage.getItem("document") });
  }
});
var AddNewRecipeButton = React.createClass({
  displayName: "AddNewRecipeButton",

  onAddNewRecipe: function onAddNewRecipe() {
    PubSub.publish('new_recipe', 'hello world!');
  },
  render: function render() {
    return React.createElement(
      "a",
      { href: "#", onClick: this.onAddNewRecipe },
      "Add new Recipe ",
      React.createElement("i", { className: "fa fa-plus" })
    );
  }
});

React.render(React.createElement(AddNewRecipeButton, null), document.getElementById('add_new_recipe'));
React.render(React.createElement(HomeButton, null), document.getElementById('navbar-brand'));
React.render(React.createElement(SearchBar, null), document.getElementById('search-bar'));
React.render(React.createElement(App, null), document.getElementById('recipes-content'));