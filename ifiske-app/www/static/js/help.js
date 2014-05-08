var createButton = function (props) {
    var btn = document.createChildElement('div');
    btn.classlist.add('button');
    btn.ontouchend = "Area.go('" + props.id + "');";
    return btn;
};
