function deleteUser(id) {
    console.log(id);
    var link  = '/' + id;
    $.ajax({
        url: link,
        type: 'DELETE',
        success: function( data ) {
            window.location.reload();
        }
    });
}

function editUser(id) {
    var link  = '/user/' + id;
    window.location = link;
}
function addUser() {
    var button = document.getElementById('idAdd');
    button.stopPropagation();
    button.preventDefault();
    console.log('click');

}