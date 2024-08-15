let index = 1;


function addColumn() {
    let countItems = $('.input-form input[type="number"]').length;
    // Create clone
    let newel = $('.input-form:last').clone(true);

    // Increment index
    index += 1;

    // Set the new element's ID to be the last ID + 1
    newel.attr("id", "input-form" + index);

    // Set id of new element
    $(newel).find('input[type=number]').attr("id", "serialNo" + index); //serial no
    $(newel).find('select:nth-child(1)').attr("id", "eName" + index); //test name
    $(newel).find('input[type=text]:nth-child(1)').attr("id", "eCode" + index); //test code

    $(newel).find('input[type=button]').attr("id", "itemDel" + index); // del btn

    // Set value
    $(newel).find('input[type=number]').val(countItems+1); // serial
    $(newel).find('input[type=text]:nth-child(1)').val(""); // test code

    // Insert element
    $(newel).insertAfter(".input-form:last");
}


// $("input[type='button']").each(function() {
//     $(this).attr("id", "itemDel" + value);
//     value++;
// });