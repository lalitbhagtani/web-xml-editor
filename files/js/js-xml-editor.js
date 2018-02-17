var deleteImageAlt = 'Delete';
var deleteImagePath = 'files/images/delete.png';
var collapseImagePath = 'files/images/collapse.png';
var expandImagePath = 'files/images/expand.png';
var copyImagePath = 'files/images/copy.png';
var copySelectImagePath = 'files/images/copy-select.png';
var indentation = 5;
var counter = 0;

var rootElementId = 'rootElement-div';
var rootElementName = 'Root';
var rootElementTableId = 'rootElement-div-table';
var rootElementImageId = 'rootElement-div-img';
var elementType = 'element';
var textType = 'text';
var cdataType = 'cdata';
var rootElement = null;
var xmlDoc = null;

var elementTreeViewClassName = 'tree-main-element';
var textTreeViewClassName = 'tree-text-element';
var treeViewSelectId = null;
var treeViewDivBackground = '#2f2f2f';
var treeViewDivSelectBackground = '#555555';
var attachedXMLToolObjectKey = 'attachedXMLToolObjectKey';
var attachedXMLObjectKey = 'attachedXMLObjectKey';

var elementBoxId = 'element-box';
var textBoxId = 'text-box';

var CloudConnectionProblemMessage = "There is some problem in connecting to cloud server, Please try again after some time";
var xmlSavedMessage = "Saved";
var noneSelectedDeleteMessage = "Please select an element to delete";
var deleteConfirmMessage = "Are you sure, you want to delete this element. Once deleted can'nt be undone";
var noneSelectedCopyMessage = "Please select an element to copy";
var noneSelectedAddMessage = "Please select an element to add";
var rootSelectedMessage = "Root element can not be deleted";
var errorParsingXml = "There is some error in parsing this Xml, Kindly check your xml and load again";
var textNodeInElementNodeMessage = "Text node cannot have child node";

var isCopyMode = false;
var treeViewCopyId = null;

var propertyBoxId = 'property-box';
var attributeNum = 0;
var attributeValues = [];

function getDivWithIdAndClass(id,className){
    var div = document.createElement('div');
    $(div).attr('id',id);
    $(div).addClass(className);
    return div;
}

function getImage(id,imagePath,className,title,alt){
    var image = document.createElement("img");
    $(image).addClass(className);
    $(image).attr('id',id);
    $(image).attr('src',imagePath);
    $(image).attr('title',title);
    $(image).attr('alt',alt);
    return image;
}

function getPropertyDivButton(id,type,className,text){
    var button = document.createElement('button');
    $(button).attr('id',id);
    $(button).attr('type',type);
    $(button).addClass(className);
    $(button).html(text);
    return button;
}

function getDivWithText(divId, className, text){
    var element = document.createElement('div');
    $(element).attr('id',divId);
    $(element).addClass(className);
    $(element).html(text);
    return element;
}

function getPropertyDiv(divClassName){
    var div = document.createElement('div');
    $(div).addClass(divClassName);
    return div;
}

function getRadioButton(id,value){
    var radioInput = document.createElement('input');
    $(radioInput).attr('id',id);
    $(radioInput).attr('type','radio');
    $(radioInput).attr('name','radioValue');
    $(radioInput).attr('value',value);
    return radioInput;
}

function getPropertyDivRadio(){
    var radioDiv = document.createElement('div');
    $(radioDiv).attr('id','value-radio-div');
    var pcdata = getRadioButton('value-radio-pcdata','PCDATA');
    $(pcdata).attr('checked','checked');
    radioDiv.appendChild(pcdata);
    radioDiv.appendChild(getPropertySpanText('property-name','PCDATA'));
    radioDiv.appendChild(getRadioButton('value-radio-cdata','CDATA'));
    radioDiv.appendChild(getPropertySpanText('property-name','CDATA'));
    return radioDiv;
}

function getPropertySpanText(spanClassName, spanText){
    var text = document.createElement('span');
    $(text).addClass(spanClassName);
    $(text).html(spanText);
    return text;
}

function getPropertyDivInput(id,type,style){
    var input = document.createElement('input');
    $(input).attr('id',id);
    $(input).attr('type',type);
    $(input).attr('style',style);
    return input;
}

function getDivWithId(id){
    var div = document.createElement('div');
    $(div).attr('id',id);
    return div;
}

function XMLElement(name,divId,tableId,imageId,valuetype,value){
    this.type = "xmlElement";
    this.name = name;
    this.value = value;
    this.childs = new Array();
    this.attributes = new Array();
    this.valueType = valuetype;
    this.divId = divId;
    this.tableId = tableId;
    this.imageId = imageId;
}

function XMLAttribute(name,value){
    this.type = "xmlAttribute";
    this.name = name;
    this.value = value;
}

function expandTreeView(treeViewTableId,largeTreeViewId,overlayId){
    var overlay = document.getElementById(overlayId);
    overlay.appendChild(createLargeTreeViewOverlay());
    overlay.style.visibility = 'visible';
    var tableView = document.getElementById(treeViewTableId);
    var largeView = document.getElementById(largeTreeViewId);
    largeView.appendChild(tableView);
}

function createLargeTreeViewOverlay(){
    var jsonObjectView = getDivWithIdAndClass('large-tree-view','large-tree-view');
    jsonObjectView.appendChild(createLargeOverlayTitleBar('Tree View',closeLargeTreeOverlayVar,'large-overlay'));
    jsonObjectView.appendChild(getDivWithIdAndClass('large-tree','large-tree'));
    return jsonObjectView;
}

var closeLargeTreeOverlayVar = function closeLargeTreeOverlay(overlayId){
    var view = document.getElementById('tree-view');
    view.appendChild(document.getElementById('tree-view-table'));
    closeLargeOverlay(overlayId);
}

function closeLargeOverlay(overlayId){
    var overlay = document.getElementById(overlayId);
    while(overlay.firstChild){
        overlay.removeChild(overlay.firstChild);
    }
    overlay.style.visibility = 'hidden';
}

function createLargeOverlayTitleBar(spanText,closeEvent,overlayId){
    var titleBar = document.createElement('div');
    $(titleBar).addClass('overlay-title-bar');
    var title = document.createElement('span');
    $(title).addClass('overlay-title');
    $(title).html(spanText);
    var closeImage = document.createElement('img');
    $(closeImage).addClass('close-overlay');
    $(closeImage).attr('alt',deleteImageAlt);
    $(closeImage).attr('src',deleteImagePath);
    closeImage.addEventListener('click',function(){
        closeEvent(overlayId);
    });
    titleBar.appendChild(title);
    titleBar.appendChild(closeImage);
    return titleBar;
}

function expandTextView(textAreaId,largeTextAreaId,overlayId){
    var overlay = document.getElementById(overlayId);
    overlay.appendChild(createLargeTextViewOverlay());
    overlay.style.visibility = 'visible';
    document.getElementById(largeTextAreaId).value = document.getElementById(textAreaId).value;
}

function createLargeTextViewOverlay(){
    var jsonTextView = getDivWithIdAndClass('large-text-view','large-tree-view');
    var textArea = document.createElement('textarea');
    $(textArea).addClass('large-text');
    $(textArea).attr('id','large-text');
    $(textArea).attr('readonly','readonly');
    jsonTextView.appendChild(createLargeOverlayTitleBar('Text View',closeLargeTextOverlayVar,'large-overlay'));
    jsonTextView.appendChild(textArea);
    return jsonTextView;
}

var closeLargeTextOverlayVar = function closeLargeTextOverlay(overlayId){
    closeLargeOverlay(overlayId);
}

function saveToDisk() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/xml;charset=utf-8,'
        + encodeURIComponent(document.getElementById('xml-text').value));
    element.setAttribute('download', 'XMLFile.xml');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function openHelpOverlay(overlayId,outerDivId){
    document.getElementById(overlayId).style.visibility = 'visible';
    document.getElementById(outerDivId).style.visibility = 'visible';
}

function closeHelpOverlay(overlayId,outerDivId){
    document.getElementById(overlayId).style.visibility = 'hidden';
    document.getElementById(outerDivId).style.visibility = 'hidden';
}

function newXml(){
    clearTool();
    loadStartingXml();
}

function clearTool(){
    var rootTable = document.getElementById(rootElementTableId);
    while(rootTable.firstChild){
        rootTable.removeChild(rootTable.firstChild);
    }
    document.getElementById(rootElementId).style.background = treeViewDivBackground;
    document.getElementById(rootElementImageId).style.visibility='hidden';
    treeViewSelectId = null;
    unCopy();
    hidePropertyBox(propertyBoxId);
}

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function saveToCloud(){
    alert(CloudConnectionProblemMessage);
}

function loadXML(){
    var xmlText = document.getElementById('xml-text');
    xmlText.value = vkbeautify.xml(xmlText.value,indentation);
    loadXMLToTool(xmlText.value);
}

function prettyXML(){
    var xmlText = document.getElementById('xml-text');
    xmlText.value = vkbeautify.xml(xmlText.value,indentation);
}

function minifyXML(){
    var xmlText = document.getElementById('xml-text');
    xmlText.value = vkbeautify.xmlmin(xmlText.value, true);
}

function load(){
    loadStartingXml();
}

function loadStartingXml(){
    rootElement = new XMLElement(rootElementName,rootElementId,rootElementTableId,rootElementImageId,elementType,'');
    jQuery.data(document.getElementById(rootElementId),attachedXMLToolObjectKey,rootElement);
    xmlDoc = (new DOMParser()).parseFromString("<Root></Root>","text/xml");
    jQuery.data(document.getElementById(rootElementId),attachedXMLObjectKey,xmlDoc.firstChild);
    document.getElementById('xml-text').value = '<Root></Root>';
    var rootDiv = document.getElementById(rootElementId);
    $(rootDiv).html(getFormattedTreeDivName(rootElementName));
    treeDivOnClick(rootElementId);
}

function checkParseXMLException(xml) {
    var parser = new DOMParser();
    var parsererrorNS = parser.parseFromString('INVALID', 'text/xml')
        .getElementsByTagName('parsererror')[0].namespaceURI;
    var dom = parser.parseFromString(xml,'text/xml');
    if(dom.getElementsByTagNameNS(parsererrorNS,'parsererror').length > 0) {
        var element = dom.getElementsByTagNameNS(parsererrorNS,'parsererror');
        var rootDiv = document.getElementById(rootElementId);
        $(rootDiv).html(element[0].innerHTML);
        jQuery.data(document.getElementById(rootElementId),attachedXMLToolObjectKey,null);
        jQuery.data(document.getElementById(rootElementId),attachedXMLToolObjectKey,null);
        return true;
    }
    return false;
}

function loadXMLToTool(xmlText){
    clearTool();
    if(!checkParseXMLException(xmlText)){
        var parser = new DOMParser();
        var xmlDocLoad = parser.parseFromString(xmlText,"text/xml");
        if(xmlDocLoad !== null && xmlDocLoad.firstChild !== null){
            xmlDoc = xmlDocLoad;
            rootElement = new XMLElement(xmlDoc.firstChild.nodeName,rootElementId,rootElementTableId,rootElementImageId,elementType,'');
            jQuery.data(document.getElementById(rootElementId),attachedXMLToolObjectKey,rootElement);
            jQuery.data(document.getElementById(rootElementId),attachedXMLObjectKey,xmlDoc.firstChild);
            getElement(xmlDoc.firstChild,rootElement);
            var rootDiv = document.getElementById(rootElementId);
            $(rootDiv).html(getFormattedTreeDivName(rootElement.name));
            treeDivOnClick(rootElementId);
        }else{
            alert(errorParsingXml);
        }
    }
}

function getElement(node,element){
    if(node !== null){
        if(node.attributes !== null && node.attributes !== 'undefined'){
            for(var i=0;i<node.attributes.length;i++){
                if(node.attributes[i] !== null){
                    element.attributes.push(new XMLAttribute(node.attributes[i].nodeName,node.attributes[i].nodeValue));
                }
            }
        }
        if(node.childNodes !== null){
            var isTraverse = false;
            for(var i=0;i<node.childNodes.length;i++){
                isTraverse = false;
                if(node.childNodes[i] !== null){
                    var childElement = null;
                    if(node.childNodes[i].nodeName === '#text'){
                        if(node.childNodes[i].nodeValue.trim() !== ''){
                            node.childNodes[i].nodeValue = node.childNodes[i].nodeValue.trim();
                            childElement = new XMLElement('','','','',textType,node.childNodes[i].nodeValue);
                        }
                    }else if(node.childNodes[i].nodeName === '#cdata-section'){
                        if(node.childNodes[i].nodeValue.trim() !== '') {
                            childElement = new XMLElement('','','','',cdataType,node.childNodes[i].nodeValue);
                        }
                    }else{
                        childElement = new XMLElement(node.childNodes[i].nodeName,'','','',elementType,'');
                        isTraverse = true;
                    }
                    if(childElement !== null){
                        var data = createElementDiv(childElement);
                        document.getElementById(element.tableId).appendChild(data.element);
                        document.getElementById(element.tableId).appendChild(data.table);
                        document.getElementById(element.imageId).style.visibility = 'visible';
                        jQuery.data(data.elementDiv,attachedXMLObjectKey,node.childNodes[i]);
                        element.childs.push(childElement);
                    }
                    if(isTraverse){
                        getElement(node.childNodes[i],childElement);
                    }
                }
            }
        }
    }
}

function setAndShowPropertyBox(treeView){
    var xmlObject = jQuery.data(treeView,attachedXMLToolObjectKey);
    var xmlElement = jQuery.data(treeView,attachedXMLObjectKey);
    if(xmlObject !== null && xmlElement !== null){
        var propertyBox = document.getElementById(propertyBoxId);
        if(xmlObject.valueType === elementType){
            propertyBox.appendChild(elementDiv());
            jQuery.data(document.getElementById(elementBoxId),attachedXMLToolObjectKey,xmlObject);
            jQuery.data(document.getElementById(elementBoxId),attachedXMLObjectKey,xmlElement);
            setElementBoxInitialValues('element-name-mandatory-text',xmlObject,'element-name',
                'attribute-mandatory-text');
        }else {
            propertyBox.appendChild(textDiv());
            jQuery.data(document.getElementById(textBoxId),attachedXMLToolObjectKey,xmlObject);
            jQuery.data(document.getElementById(textBoxId),attachedXMLObjectKey,xmlElement);
            setTextBoxInitialValues('element-value',xmlObject,'value-radio-pcdata','value-radio-cdata');
        }
    }else{
        treeView.style.background = treeViewDivBackground;
    }
}

function setElementBoxInitialValues(elementNameMandatoryId,xmlObject,elementName,attributeNameMandatoryId){
    document.getElementById(elementNameMandatoryId).style.display = 'none';
    document.getElementById(attributeNameMandatoryId).style.display = 'none';
    document.getElementById(elementName).value = xmlObject.name;
    attributeValues = [];
    attributeNum = 0;
    if(xmlObject.attributes !== null){
        var attributes = document.getElementById('attribute-div');
        for(var obj in xmlObject.attributes){
            if(obj !== null){
                attributeNum = attributeNum + 1;
                attributes.appendChild(getAttribute(attributeNum,'attribute-div',xmlObject.attributes[obj].name,
                    xmlObject.attributes[obj].value));
                attributeValues.push(attributeNum);
            }
        }
    }
}

function setTextBoxInitialValues(elementValue,xmlObject,radioPCDATA,radioCDATA){
    document.getElementById(elementValue).value = xmlObject.value;
    if(xmlObject.valueType === cdataType){
        document.getElementById(radioCDATA).checked = 'checked';
    }else{
        document.getElementById(radioPCDATA).checked = 'checked';
    }
}

function hidePropertyBox(propertyBoxId){
    var propertyBox = document.getElementById(propertyBoxId);
    while (propertyBox.firstChild) {
        propertyBox.removeChild(propertyBox.firstChild);
    }
}

function textDiv(){
    var textDiv = getDivWithId(textBoxId);
    textDiv.appendChild(elementValue());
    textDiv.appendChild(elementValueType());
    textDiv.appendChild(elementButton(textType));
    return textDiv;
}

function elementDiv(){
    var elementDiv = getDivWithId(elementBoxId);
    elementDiv.appendChild(elementName());
    elementDiv.appendChild(attributeHeader());
    elementDiv.appendChild(attributeDiv());
    elementDiv.appendChild(elementButton(elementType));
    return elementDiv;
}

function checkElementOnblur(elementName,mandatoryDiv){
    var mandatoryDiv = document.getElementById(mandatoryDiv);
    var elementInput = document.getElementById(elementName);
    elementInput.value = elementInput.value.trim();
    checkName(mandatoryDiv,elementInput.value);
}

function checkName(mandatoryDiv,value){
    if(value === undefined || value === ''){
        showMandatoryDiv(mandatoryDiv,'* Name is a Mandatory Field');
    }else if(containSpaces(value)){
        showMandatoryDiv(mandatoryDiv,'* Element names cannot contain spaces');
    }else if(startsWithLetterOrUnderScore(value)){
        showMandatoryDiv(mandatoryDiv,'* Element names must start with a letter or underscore');
    }else if(containLDUSP(value)){
        showMandatoryDiv(mandatoryDiv,'* Element names can contain letters, digits, hyphens, underscores, and periods');
    }else if(startsWithXml(value)){
        showMandatoryDiv(mandatoryDiv,'* Element names cannot start with the letters xml');
    }else{
        return true;
    }
    return false;
}

function showMandatoryDiv(mandatoryDiv,message){
    $(mandatoryDiv).html(message);
    mandatoryDiv.style.display = 'block';
}

function containSpaces(value){
    var inValid = new RegExp("[\\s]");
    return inValid.test(value);
}

function containLDUSP(value){
    var inValid = new RegExp("[^A-Za-z0-9_\\-\\.]");
    return inValid.test(value);
}

function startsWithXml(value){
    if(value.length >= 3){
        if(value.substr(0,3).toLowerCase() === 'xml'){
            return true;
        }
    }
}

function startsWithLetterOrUnderScore(value){
    var inValid = new RegExp("[A-Za-z_]");
    return !inValid.test(value.charAt(0));
}

function checkElementOnFocus(mandatoryDiv){
    var mandatoryDiv = document.getElementById(mandatoryDiv);
    $(mandatoryDiv).html('* Name is a Mandatory Field');
    mandatoryDiv.style.display = 'none';
}

function attributeHeader(){
    var valueDiv = getPropertyDiv('property-div');
    var value = getPropertySpanText('property-attribute','Attributes :');
    valueDiv.appendChild(value);
    return valueDiv;
}

function elementName(){
    var nameDiv = getPropertyDiv('property-div');
    var name = getPropertySpanText('property-name','Name :- ');
    var input = getPropertyDivInput('element-name','text','width:60%');
    input.addEventListener('blur',function(){
        checkElementOnblur('element-name','element-name-mandatory-text');
    });
    input.addEventListener('focus',function(){
        checkElementOnFocus('element-name-mandatory-text');
    });
    var nameMandatory = getDivWithText('element-name-mandatory-text','mandatory-text','* Name is a Mandatory Field');
    nameDiv.appendChild(name);
    nameDiv.appendChild(input);
    nameDiv.appendChild(nameMandatory);
    return nameDiv;
}

function elementValue(){
    var valueDiv = getPropertyDiv('property-div');
    var value = getPropertySpanText('property-value','Value :- ');
    var input = getPropertyDivInput('element-value','text','width:60%');
    valueDiv.appendChild(value);
    valueDiv.appendChild(input);
    return valueDiv;
}

function elementValueType(){
    var valueDiv = getPropertyDiv('property-div');
    var value = getPropertyDivRadio();
    valueDiv.appendChild(value);
    return valueDiv;
}

function elementButton(type){
    var setDiv = getPropertyDiv('property-div');
    var button = getPropertyDivButton('element-set','button','button-set','Set');
    if(type === elementType){
        button.addEventListener('click',function(){
            setXmlElementValue('element-name','element-name-mandatory-text')
        });
    }else if(type === textType){
        button.addEventListener('click',function(){
            setXmlTextValue('element-value','value-radio-pcdata','value-radio-cdata')
        });
    }
    setDiv.appendChild(button);
    return setDiv;
}

function setXmlElementValue(elementNameId,elementNameMandatoryId){
    var name = '';
    var mandatoryDiv = document.getElementById(elementNameMandatoryId);
    var elementName = document.getElementById(elementNameId);
    elementName.value = elementName.value.trim();
    if(checkName(mandatoryDiv,elementName.value)){
        name = elementName.value;
    }
    var attributes = new Array();
    var attributeName,attributeValue;
    if(attributeValues !== null){
        for(var i in attributeValues){
            if(attributeValues[i] !== null){
                attributeName = document.getElementById('attribute-hidden-'+attributeValues[i]);
                attributeValue = document.getElementById('attribute-value-'+attributeValues[i]);
                if(attributeName !== null && attributeValue !== null){
                    attributes.push(new XMLAttribute(attributeName.value,attributeValue.value));
                }
            }
        }
    }
    document.getElementById('attribute-mandatory-text').style.display = 'none';
    document.getElementById('attribute-add-input').value = '';
    var elementBox = document.getElementById(elementBoxId);
    var xmlObject = jQuery.data(elementBox,attachedXMLToolObjectKey);
    var xmlElement = jQuery.data(elementBox,attachedXMLObjectKey);
    var selectedDiv = document.getElementById(treeViewSelectId);
    if(xmlObject !== null){
        xmlObject.name = name;
        xmlObject.attributes = attributes;
        removeAttributes(xmlElement);
        if(xmlElement.nodeName !== name){
            var element = xmlDoc.createElement(name);
            addAttributes(xmlObject,element);
            addChildren(xmlElement,element);
            if(xmlObject.divId === rootElementId){
                xmlDoc.removeChild(xmlElement);
                xmlDoc.appendChild(element);
            }else{
                xmlElement.parentElement.replaceChild(element,xmlElement);
            }
            jQuery.data(elementBox,attachedXMLObjectKey,element);
            jQuery.data(selectedDiv,attachedXMLObjectKey,element);
        }else{
            addAttributes(xmlObject,xmlElement);
        }
        $(selectedDiv).html(getFormattedTreeDivName(xmlObject.name));
        setFormattedXMLText();
    }
    return;
}

function setXmlTextValue(elementValueId,radioPCDATAId,radioCDATAId){
    var value = '';
    var elementValue = document.getElementById(elementValueId);
    if(!(elementValue.value === undefined || elementValue.value === '')){
        value = elementValue.value;
    }
    var valueType = '#text';
    var radioCDATA = document.getElementById(radioCDATAId);
    var radioPCDATA = document.getElementById(radioPCDATAId);
    if(radioCDATA.checked === true){
        valueType = '#cdata-section';
    }else if(radioPCDATA.checked === true){
        valueType = '#text';
    }
    var textBox = document.getElementById(textBoxId);
    var xmlObject = jQuery.data(textBox,attachedXMLToolObjectKey);
    var xmlElement = jQuery.data(textBox,attachedXMLObjectKey);
    var selectedDiv = document.getElementById(treeViewSelectId);
    if(xmlObject !== null){
        xmlObject.value = value;
        if(xmlElement.nodeName === valueType){
            xmlElement.nodeValue = value;
        }else{
            var textNode = null;
            if(valueType === '#cdata-section'){
                textNode = xmlDoc.createCDATASection(value);
                xmlObject.valueType = cdataType;
            }else {
                textNode = xmlDoc.createTextNode(value);
                xmlObject.valueType = textType;
            }
            xmlElement.parentElement.replaceChild(textNode,xmlElement);
            jQuery.data(textBox,attachedXMLObjectKey,textNode);
            jQuery.data(selectedDiv,attachedXMLObjectKey,textNode);
        }
        $(selectedDiv).html(getFormattedTreeDivName(xmlObject.value));
        setFormattedXMLText();
    }
    return;
}

function removeAttributes(xmlElement){
    while(xmlElement.attributes.length > 0) {
        xmlElement.removeAttributeNode(xmlElement.attributes[0]);
    }
}

function addAttributes(xmlObject,xmlElement){
    for(var i in xmlObject.attributes){
        xmlElement.setAttribute(xmlObject.attributes[i].name,xmlObject.attributes[i].value);
    }
}

function addChildren(xmlElement,element){
    while(xmlElement.childElementCount > 0){
        if(xmlElement.children[0] !== null){
            element.appendChild(xmlElement.children[0]);
        }
    }
}

function attributeDiv() {
    var attributeMainDiv = getPropertyDiv('property-div');
    var attributesDiv = getDivWithId('attribute-div');
    var attributeAddDiv = getPropertyDiv('attribute-add-div');
    var input = getPropertyDivInput('attribute-add-input','text','width:60%');
    $(input).addClass('attribute-add-input');
    $(input).attr('placeholder', 'Name');
    var button = getPropertyDivButton('attribute-add-button','button','','Add');
    $(button).attr('style', 'height: 22px');
    button.addEventListener('click', function() {
        addAttribute('attribute-mandatory-text','attribute-add-input','attribute-div');
    });
    var mandatory = getDivWithText('attribute-mandatory-text','attribute-mandatory-text', '* Name is a Mandatory Field');
    attributeAddDiv.appendChild(input);
    attributeAddDiv.appendChild(button);
    attributeAddDiv.appendChild(mandatory);
    attributeMainDiv.appendChild(attributesDiv);
    attributeMainDiv.appendChild(attributeAddDiv);
    return attributeMainDiv;
}

function addAttribute(mandatoryId,inputId,attributeDivId) {
    var mandatory = document.getElementById(mandatoryId);
    mandatory.style.display = 'none';
    var input = document.getElementById(inputId);
    input.value = input.value.trim();
    if (input.value === undefined || input.value === '') {
        $(mandatory).html('* Attribute Name is a Mandatory Field');
        mandatory.style.display = 'block';
    }else if(containSpaces(input.value)){
        $(mandatory).html('* Attribute names cannot contain spaces');
        mandatory.style.display = 'block';
    }else if(startsWithLetterOrUnderScore(input.value)){
        $(mandatory).html('* Attribute names must start with a letter or underscore');
        mandatory.style.display = 'block';
    }else if(containLDUSP(input.value)){
        $(mandatory).html('* Attribute names can contain letters, digits, hyphens, underscores, and periods');
        mandatory.style.display = 'block';
    }else {
        attributeNum = attributeNum + 1;
        mandatory.style.display = 'none';
        var attributes = document.getElementById(attributeDivId);
        var newAttribute = getAttribute(attributeNum,attributeDivId,input.value,'');
        attributes.appendChild(newAttribute);
        input.value = '';
        attributeValues.push(attributeNum);
    }
}

function getFormattedAttributeName(name){
    if(name.length > 9){
        return name.substring(0,9) + ".. :";
    }else{
        return name + " :";
    }
}

function getAttribute(num,attributeDivId,text,inputValue){
    var id = "attribute-" + num;
    var attribute = getDivWithIdAndClass(id,'attribute');
    var span = getPropertySpanText('attribute-name',getFormattedAttributeName(text));
    $(span).attr('id','attribute-name-'+num);
    var input = getPropertyDivInput('attribute-value-'+num,'text','float:right;width:30%');
    input.value = inputValue;
    var img = getImage('attribute-delete-image-'+num,deleteImagePath,'attribute-delete-image','Delete Attribute','Delete Attribute');
    img.addEventListener('click', function() {
        deleteAttribute(num, id, attributeDivId);
    });
    var hidden = document.createElement('input');
    $(hidden).attr('type','hidden');
    $(hidden).attr('id','attribute-hidden-'+num);
    $(hidden).attr('value',text);
    attribute.appendChild(span);
    attribute.appendChild(img);
    attribute.appendChild(input);
    attribute.appendChild(hidden);
    return attribute
}

function deleteAttribute(num, id, attributeDivId) {
    var attributeDiv = document.getElementById(attributeDivId);
    var attributeToDelete = document.getElementById(id);
    attributeDiv.removeChild(attributeToDelete);
    var i = attributeValues.indexOf(num);
    if(i != -1) {
        attributeValues.splice(i, 1);
    }
}

function unCopy(){
    document.getElementById('copy-element').src = copyImagePath;
    isCopyMode = false;
    treeViewCopyId = null;
}

function copy(){
    if(treeViewSelectId === null){
        alert(noneSelectedCopyMessage);
    }else{
        document.getElementById('copy-element').src = copySelectImagePath;
        isCopyMode = true;
        treeViewCopyId = treeViewSelectId;
    }
}

function addElementNode(type){
    if(treeViewSelectId == null){
        alert(noneSelectedAddMessage);
    }else {
        unCopy();
        var parentElement = document.getElementById(treeViewSelectId);
        var parentXMLToolObject = jQuery.data(parentElement,attachedXMLToolObjectKey);
        if(parentXMLToolObject.valueType === elementType){
            var xmlElement = null;
            var data = null;
            if(type === 'element'){
                xmlElement = new XMLElement('New_Element','','','',elementType,'');
                data = createElementDiv(xmlElement);
            }else if(type === 'text'){
                xmlElement = new XMLElement('','','','',textType,'New Text Node');
                data = createElementDiv(xmlElement);
            }
            if(xmlElement !== null && data !== null){
                document.getElementById(parentXMLToolObject.tableId).style.display = 'block';
                document.getElementById(parentXMLToolObject.tableId).appendChild(data.element);
                document.getElementById(parentXMLToolObject.tableId).appendChild(data.table);
                document.getElementById(parentXMLToolObject.imageId).style.visibility = 'visible';
                parentXMLToolObject.childs.push(xmlElement);
                var parentXMLObject = jQuery.data(parentElement,attachedXMLObjectKey);
                parentXMLObject.appendChild(data.docElement);
                setFormattedXMLText();
                treeDivOnClick(data.id);
            }
        }else{
            alert(textNodeInElementNodeMessage);
        }
    }
}

function getFormattedTreeDivId(name){
    counter = counter + 1;
    if(name.length >= 5){
        return name.substring(0,5) + "-" + counter;
    }else{
        return name + "-" + counter;
    }
}

function getFormattedTreeDivName(name){
    if(name.length > 15){
        return name;//.substring(0,15) + "...";
    }else{
        return name;
    }
}

function createElementDiv(xmlElement){
    var elementClassName,docElement,name;
    if(xmlElement.valueType === elementType){
        elementClassName = elementTreeViewClassName;
        name = xmlElement.name;
        docElement = xmlDoc.createElement(xmlElement.name);
    }else{
        elementClassName = textTreeViewClassName;
        name = xmlElement.value;
        if(xmlElement.valueType === textType){
            docElement = xmlDoc.createTextNode(xmlElement.value);
        }else{
            docElement = xmlDoc.createCDATASection(xmlElement.value);
        }
    }
    var divId = getFormattedTreeDivId(name)+"-div";
    xmlElement.divId = divId;
    var collapseImage = getImage(divId+'-img',collapseImagePath,'collapse-indent','Collapse','Collapse');
    collapseImage.addEventListener('click',function(){
        treeCollapseImageOnClick(divId+'-table',divId+'-img',divId);
    });

    var element = getDivWithText(divId,elementClassName,getFormattedTreeDivName(name));
    jQuery.data(element,attachedXMLToolObjectKey,xmlElement);
    jQuery.data(element,attachedXMLObjectKey,docElement);
    element.addEventListener('click',function(){
        treeDivOnClick(divId);
    });
    var table = document.createElement("table");
    $(table).attr('id',divId+'-table');
    $(table).addClass('tree-table');
    xmlElement.tableId = divId+'-table';
    xmlElement.imageId = divId+'-img';
    var row = document.createElement("tr");
    $(row).attr('id',divId+'-tr');
    var rowTable = document.createElement("tr");
    $(rowTable).attr('id',divId+'-table-tr');
    var column = document.createElement("td");
    column.appendChild(collapseImage);
    column.appendChild(element);
    row.appendChild(column);
    var columnTable = document.createElement("td");
    columnTable.appendChild(table);
    rowTable.appendChild(columnTable);
    return  {
        element: row,
        id: divId,
        table:rowTable,
        docElement:docElement,
        elementDiv:element
    };
}

function deleteElement(){
    if(treeViewSelectId == null){
        alert(noneSelectedDeleteMessage);
    }else if(treeViewSelectId === rootElementId){
        alert(rootSelectedMessage);
    }else{
        var ok = confirm(deleteConfirmMessage);
        if(ok){
            unCopy();
            var selectedDiv = document.getElementById(treeViewSelectId);
            var xmlElement = jQuery.data(selectedDiv,attachedXMLToolObjectKey);
            var xmlObject = jQuery.data(selectedDiv,attachedXMLObjectKey);
            var treeViewTr = document.getElementById(treeViewSelectId+'-tr');
            var treeViewTableTr = document.getElementById(treeViewSelectId+'-table-tr');
            var parentTableView = treeViewTr.parentNode;
            parentTableView.removeChild(treeViewTr);
            if(treeViewTableTr !== null){
                parentTableView.removeChild(treeViewTableTr);
            }
            var parentDivId = parentTableView.id.replace("-table","");
            var parentDiv = document.getElementById(parentDivId);
            var parentXmlElement = jQuery.data(parentDiv,attachedXMLToolObjectKey);
            var parentXmlObject = jQuery.data(parentDiv,attachedXMLObjectKey);
            if(parentXmlElement != null && parentXmlElement.childs != null){
                var i = parentXmlElement.childs.indexOf(xmlElement);
                if(i != -1) {
                    parentXmlElement.childs.splice(i, 1);
                }
            }
            if(parentXmlElement.childs.length == 0){
                document.getElementById(parentDivId+'-img').style.visibility='hidden';
                document.getElementById(parentDivId+'-table').style.display = 'none';
            }
            parentXmlObject.removeChild(xmlObject);
            setFormattedXMLText();
            treeDivOnClick(parentDivId);
        }
    }
}

function treeDivOnClick(divId){
    if(treeViewSelectId != null){
        var treeView = document.getElementById(treeViewSelectId);
        if(treeView != null){
            treeView.style.background = treeViewDivBackground;
        }
    }
    var treeView = document.getElementById(divId);
    treeView.style.background = treeViewDivSelectBackground;
    treeViewSelectId = divId;
    if(isCopyMode){
        var name = paste();
        unCopy();
        if(name === treeViewSelectId){
            hidePropertyBox(propertyBoxId);
            setAndShowPropertyBox(treeView);
        }else{
            treeDivOnClick(name);
        }
    }else{
        hidePropertyBox(propertyBoxId);
        setAndShowPropertyBox(treeView);
    }
}

function treeCollapseImageOnClick(divIdTable,divIdImage,divId){
    var tableView = document.getElementById(divIdTable);
    var imageView = document.getElementById(divIdImage);
    if(imageView.src.includes(collapseImagePath)){
        tableView.style.display = 'none';
        imageView.src = expandImagePath;
    }else if(imageView.src.includes(expandImagePath)){
        tableView.style.display = 'block';
        imageView.src = collapseImagePath;
    }
    treeDivOnClick(divId);
}

function paste(){
    var returnData = treeViewSelectId;
    var copyElement = document.getElementById(treeViewCopyId);
    var copyObject = jQuery.data(copyElement,attachedXMLToolObjectKey);
    var pasteElement = document.getElementById(treeViewSelectId);
    var pasteObject = jQuery.data(pasteElement,attachedXMLToolObjectKey);
    var pasteXMLObject = jQuery.data(pasteElement,attachedXMLObjectKey);
    if(pasteObject.valueType === elementType){
        var newXMLObject = cloneObject(pasteObject,copyObject,pasteXMLObject);
        if(newXMLObject !== null){
            pasteObject.childs.push(newXMLObject);
            setFormattedXMLText();
            returnData = newXMLObject.divId;
        }
    }else{
        alert(textNodeInElementNodeMessage);
    }
    return returnData;
}

function cloneObject(parentXMLObject,xmlObject,pasteXMLObject){
    var xmlElement = null;
    if(xmlObject.valueType === elementType){
        xmlElement = new XMLElement(xmlObject.name,'','','',elementType,'');
    }else{
        xmlElement = new XMLElement('','','','',xmlObject.valueType,xmlObject.value);
    }
    var data = createElementDiv(xmlElement);
    document.getElementById(parentXMLObject.tableId).appendChild(data.element);
    document.getElementById(parentXMLObject.tableId).appendChild(data.table);
    document.getElementById(parentXMLObject.imageId).style.visibility = 'visible';
    pasteXMLObject.appendChild(data.docElement);
    for(var i in xmlObject.attributes){
        xmlElement.attributes.push(new XMLAttribute(xmlObject.name,xmlObject.value));
        pasteXMLObject.setAttribute(xmlObject.name,xmlObject.value);
    }
    for(var i in xmlObject.childs){
        xmlElement.childs.push(cloneObject(xmlElement,xmlObject.childs[i],data.docElement));
    }
    return xmlElement;
}

function setFormattedXMLText(){
    var xmlText = document.getElementById('xml-text');
    xmlText.value = vkbeautify.xml(xmlDoc.firstChild.outerHTML,indentation);
}

