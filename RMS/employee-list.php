<?php
include 'assets/conn/conn.php';
// include 'assets/process/empUpdate.php';
include 'assets/user/info.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
    <title>BARMS - Employee List</title>

    <!-- Favicon -->
    <link rel="shortcut icon" type="image/x-icon" href="./assets/img/it_logo.png">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="./assets/css/bootstrap.min.css">

    <!-- FontAwesome CSS -->
    <link rel="stylesheet" href="./assets/css/font-awesome.min.css">

    <!-- Feathericon CSS -->
    <link rel="stylesheet" href="./assets/css/feathericon.min.css">

    <!-- Select2 Plugin -->
    <link rel="stylesheet" href="./assets/css/select2.min.css" />

    <!-- Main CSS -->
    <link rel="stylesheet" href="./assets/css/style.css">
    <link rel="stylesheet" href="./assets/css/style2.css">

</head>

<body class="mini-sidebar">

    <!-- Main Wrapper -->
    <div class="main-wrapper">

        <!-- Header -->
        <div class="header">

            <a href="javascript:void(0);" id="toggle_btn">
                <i class="fe fe-text-align-left"></i>
            </a>

            <!-- Logo -->
            <div class="header-left">
                <a href="Dashboard.php" class="logo">
                    <img src="<?php echo $logoDash; ?>" alt="Logo" style="margin-left: -15%">
                </a>
                <a href="Dashboard.php" class="logo logo-small">
                    <img src="<?php echo $logoDash; ?>" alt="Logo" style="margin-left: 5%">
                </a>
            </div>

            <!-- /Logo -->
            <!-- <div class="top-nav-search float-right" style="">
                    <a href="" class="float-right">
                <img src="assets/img/it_logo.png" alt="Logo" style="max-height: 40px; margin-top: 50%;  transform: translate(-50%, -50%);">
                </a>
            </div> -->

            <!-- Mobile Menu Toggle -->
            <a class="mobile_btn" id="mobile_btn">
                <i class="fa fa-bars"></i>
            </a>
            <!-- /Mobile Menu Toggle -->

            <!-- /Header Right Menu -->

        </div>
        <!-- /Header -->

        <div class="sidebar" id="sidebar">
            <div class="sidebar-inner slimscroll">
                <div id="sidebar-menu" class="sidebar-menu">
                    <!-- Sidebar goes here -->
                </div>
            </div>
        </div>

        <!-- Page Wrapper -->
        <div class="page-wrapper">
            <div class="content container-fluid">
                <div class="col-sm-12 col">
                    <a href="#Add_Employee" data-toggle="modal" class="btn btn-primary float-right mt-2">Add</a>
                </div>
                <!-- Page Header -->
                <div class="page-header">
                    <div class="row">
                        <div class="col-sm-12">
                            <h3 class="page-title">Employee List</h3>
                            <ul class="breadcrumb">
                                <li class="breadcrumb-item"><a href="Dashboard.php">Dashboard</a></li>
                                <!-- <li class="breadcrumb-item"><a href="javascript:(0);">Users</a></li> -->
                                <li class="breadcrumb-item active">Employee List</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- /Page Header -->

                <div class="row">
                    <div class="col-sm-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="table-responsive">
                                    <div class="table-responsive">
                                        <table class="table ">
                                            <thead>
                                                <tr>
                                                    <th scope="col ">Sl No.</th>
                                                    <th scope="col ">Name</th>
                                                    <th scope="col ">Employee ID</th>
                                                    <th scope="col ">Profession</th>

                                                    <th scope="col ">Edit</th>
                                                    <th scope="col ">Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>


                                                <!-- PHP Query for fetching Employee's data from database and displaying in the <table> format. -->
                                                <?php
                                                $selectquery = "SELECT * FROM employee ORDER BY emp_sl DESC";

                                                $query = mysqli_query($con, $selectquery);

                                                $nums = mysqli_num_rows($query);
                                                $sl = $nums;
                                                while ($res = mysqli_fetch_assoc($query)) {
                                                    ?>
                                                    <tr>
                                                        <th scope="row ">
                                                            <?php echo $sl; ?>
                                                        </th>
                                                        <td>
                                                            <?php echo $res['emp_name']; ?>
                                                        </td>
                                                        <td>
                                                            <?php echo $res['emp_no']; ?>
                                                        </td>
                                                        <td>
                                                            <?php echo $res['emp_prof']; ?>
                                                        </td>

                                                        <!-- Edit Entry -->
                                                        <td><a onclick="putVal(
                                    '<?php echo $sl; ?>','<?php echo $res['emp_sl']; ?>' , '<?php echo $res['emp_name']; ?>' , '<?php echo $res['emp_no'] ?>' , '<?php echo $res['emp_prof']; ?>')"
                                                                href="#updateEmp" data-toggle="modal"
                                                                class="fa fa-edit"></a></td>



                                                        <!--HyperLink for Deleting data in database through Employee's ID (did). -->
                                                        <td><a
                                                                href="assets/process/empDel.php?e_id=<?php echo $res['emp_sl'] ?>"><i
                                                                    class="fa fa-trash" aria-hidden="true"></i></a></td>
                                                    </tr>
                                                    <?php
                                                    $sl--;
                                                }
                                                ?>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <!-- /Page Wrapper -->

    </div>
    <!-- Add Modal -->
    <div class="modal fade" id="Add_Employee" aria-hidden="true" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add Employee</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form action="assets/process/empAdd.php" method="POST">


                        <div class="col-12">
                            <div class="form-label-group">
                                <input type="text" id="id_name" class="form-control" name="e_name"
                                    placeholder="Employee Name" required="required"
                                    oninvalid="this.setCustomValidity('Enter Employee Name')"
                                    oninput="setCustomValidity('')">
                                <label for="id_name">Name</label>
                                <div class="validate"></div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-label-group">
                                <input type="text" id="id_no" class="form-control" name="e_no" placeholder="Uniquie ID"
                                    required="required" oninvalid="this.setCustomValidity('Enter Unique ID')"
                                    oninput="setCustomValidity('')">
                                <label for="id_name">Employee ID</label>
                                <div class="validate"></div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="form-label-group">
                                <select id="e_prof" name="e_prof" class="form-control" type="text" required="required">
                                    <option value="" disabled selected="">Select Profession</option>
                                    <?php
                                        $profession_records = mysqli_query($con, "SELECT * From professions");
                                        while ($prof_data = mysqli_fetch_array($profession_records)) {
                                            echo "<option value'" . $prof_data['prof_name'] . "'>" . $prof_data['prof_name'] . "</option>";
                                        }
                                    ?>
                                </select>
                                <!-- <input class="form-control" name="e_prof" id="id_profession" type="text" placeholder="Profession" required="required" oninvalid="this.setCustomValidity('Enter Profession')" oninput="setCustomValidity('')"> -->
                                <!-- <label for="e_prof">Profession</label> -->
                                <div class="validate"></div>
                            </div>
                        </div>




                        <div class="col-12">
                            <button type="submit" name="submit" id="id_addBtn"
                                class="btn btn-primary btn-xl text-uppercase center " onclick="return checkEmpty()"
                                value="Send ">Add</button>
                            <div class="validate "></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Update Modal -->

    <div class="modal fade" id="updateEmp" aria-hidden="true" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Update Employee</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form action="assets/process/empUpdate.php" method="POST">

                        <div class="col-12">
                            <div class="form-label-group">
                                <input type="text" id="sl_id" class="form-control" name="sl_id" placeholder="ID"
                                    required="required" readonly>
                                <label for="id_eid">Sl No.</label>
                                <div class="validate"></div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-label-group">
                                <input type="hidden" id="eu_id" class="form-control" name="e_id" placeholder="ID"
                                    required="required" readonly>
                                <label for="id_eid">Sl No.</label>
                                <div class="validate"></div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="form-label-group">
                                <input type="text" id="eu_name" class="form-control" name="e_name" placeholder="Name"
                                    required="required">
                                <label for="id_name">Employee Name</label>
                                <div class="validate"></div>
                            </div>
                        </div>


                        <div class="col-12">
                            <div class="form-label-group">
                                <input class="form-control" id="eu_no" name="e_no" type="text" placeholder="Uniquie ID*"
                                    required="required">
                                <label for="e_no">Uniquie ID</label>
                                <div class="validate"></div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="form-label-group">
                                <select id="eu_prof" name="e_prof" class="form-control" type="text" required="required">
                                    <option value="" readonly selected="">Select Profession</option>
                                    <?php
                                        $profession_records = mysqli_query($con, "SELECT * From professions");
                                        while ($prof_data = mysqli_fetch_array($profession_records)) {
                                            echo "<option value'" . $prof_data['prof_name'] . "'>" . $prof_data['prof_name'] . "</option>";
                                        }
                                    ?>
                                </select>
                            </div>
                        </div>


                        <div class="col-12">
                            <button type="submit" name="updateEmp" id="id_addBtn"
                                class="btn btn-primary btn-xl text-uppercase center " onclick="return checkEmpty()"
                                value="Send ">Update</button>
                            <div class="validate "></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- End of Update Modal -->
    <!-- /Main Wrapper -->

    <!-- jQuery -->
    <script src="assets/js/jquery-3.2.1.min.js"></script>

    <!-- Bootstrap Core JS -->
    <!-- <script src="assets/js/popper.min.js"></script> -->
    <script src="assets/js/bootstrap.min.js"></script>

    <!-- Slimscroll JS -->
    <script src="assets/plugins/slimscroll/jquery.slimscroll.min.js"></script>

    <!-- Sidebar Inject -->
    <script>
        $("#sidebar-menu").load("./assets/process/sidebar.html");
    </script>

    <!-- Update Modal Values -->
    <script>
        function putVal(sl_id, eu_id, eu_name, eu_no, eu_prof) {
            document.getElementById("sl_id").value = sl_id;
            document.getElementById("eu_id").value = eu_id;
            document.getElementById("eu_name").value = eu_name;
            document.getElementById("eu_no").value = eu_no;
            document.getElementById("eu_prof").value = eu_prof;

        }
    </script>

</body>

</html>