function checkEmpty() {
    if (document.getElementById("id_phone").value <= 999999999) {

        alert("Please enter valid phone number");
        return false;

    } else {

        return true;

    }

}