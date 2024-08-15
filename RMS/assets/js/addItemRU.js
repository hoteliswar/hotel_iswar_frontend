let index = 1;


function addColumn(times) {

    index += 1;

    // Fix not responding select after clone
    // if ($(".test_name").data('select2')) {
        // $(".test_name").select2("destroy");
    // } // Fix end

    // Create clone
    for (let i = 0; i < times; i++) {
        let newel = $('.input-form:last').clone(true);

        // Set id of new element
        $(newel).find('input[type=number]').attr("id", index); //serial no
        $(newel).find('select:nth-child(1)').attr("id","eName"+index); //test name
        $(newel).find('input[type=text]:nth-child(1)').attr("id", "eCode" + index); //test code

        // Set value
        $(newel).find('input[type=number]').val(index); // serial
        $(newel).find('input[type=text]:nth-child(1)').val(""); // test code

        // Insert element
        $(newel).insertAfter(".input-form:last");
    }
}