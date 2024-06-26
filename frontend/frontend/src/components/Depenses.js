import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import {
  createDepense,
  getDepense,
  deleteDepense,
  updateDepense,
  setError,
} from "../redux/features/depenseSlice";
import { getCategories } from "../redux/features/categorieSlice";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { toast } from "react-toastify";
import "../assets/styles/loadingIcon.css";
import "../assets/styles/select.css";
//import '../assets/styles/popup.css'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#474242",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Depenses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { depenses, loading } = useSelector((state) => ({ ...state.depense }));
  const [showAddDepensePopup, setShowAddDepensePopup] = useState(false);
  const [showEditDepensePopup, setShowEditDepensePopup] = useState(false);
  const [showDeleteDepensePopup, setShowDeleteDepensePopup] = useState(false);
  const [depenseData, setDepenseData] = useState({
    description: "",
    CategorieNomCat: "",
    montantdep: "",
  });
  const [selectedDepenseForEdit, setSelectedDepenseForEdit] = useState(null);
  const [selectedDepenseForDelete, setSelectedDepenseForDelete] =
    useState(null);
  const [stringErrorMessage, setStringErrorMessage] = useState("");
  const { categories } = useSelector((state) => ({ ...state.categorie }));

  const { error } = useSelector((state) => state.depense);
  const role = localStorage.getItem("role");

  useEffect(() => {
    dispatch(getDepense());
    dispatch(getCategories());
  }, [dispatch]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDepenseData((prevDepenseData) => ({
      ...prevDepenseData,
      [name]: value,
    }));
    dispatch(setError(""));
  };

  const handleAddDepense = () => {
    setShowAddDepensePopup(true);
    setShowEditDepensePopup(false);
    setShowDeleteDepensePopup(false);
    setDepenseData("");
  };

  const handleAddDepenseSubmit = (e) => {
    e.preventDefault();
    if (
      depenseData.description &&
      depenseData.CategorieNomCat &&
      depenseData.montantdep
    ) {
      const formValue = {
        description: depenseData.description,
        categorie: depenseData.CategorieNomCat,
        montantdep: depenseData.montantdep,
      };
      if (stringErrorMessage) {
        return;
      }

      dispatch(createDepense({ formValue, navigate, toast }));
    } else {
      toast.error("Field can not be null");
      dispatch(setError("Field can not be null"));
    }
    setShowAddDepensePopup(false);
  };

  const handleEditDepense = (depense) => {
    setSelectedDepenseForEdit(depense);

    setDepenseData(depense);

    if (selectedDepenseForEdit) {
      setShowEditDepensePopup(true);
      setShowAddDepensePopup(false);
      setShowDeleteDepensePopup(false);
    }
  };

  const handleConfirmEditDepense = (e) => {
    e.preventDefault();
    if (selectedDepenseForEdit) {
      const id = selectedDepenseForEdit.iddepense;
      const formValue = {
        description: depenseData.description,
        CategorieNomCat: depenseData.CategorieNomCat,
        montantdep: depenseData.montantdep,
      };
      dispatch(updateDepense({ id, formValue, toast, navigate }));
    }
    setShowEditDepensePopup(false);
  };

  const handleDeleteDepense = (depense) => {
    setSelectedDepenseForDelete(depense);
    setShowDeleteDepensePopup(true);
    setShowAddDepensePopup(false);
    setShowEditDepensePopup(false);
  };

  const handleConfirmDeleteDepense = () => {
    if (selectedDepenseForDelete) {
      const id = selectedDepenseForDelete.iddepense;
      dispatch(deleteDepense({ id, toast, navigate }));
    }
    setShowDeleteDepensePopup(false);
  };

  const rowsPerPageOptions = [5, 10, 25, { value: -1, label: "Tout" }];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <div style={{ maxWidth: "1000px" }} className="container mt-4">
      {showAddDepensePopup && (
        <div className="popup">
          <h2>Add new spent</h2>
          <form id="addDepenseForm" onSubmit={handleAddDepenseSubmit}>
            <div className="row mb-3">
              <div className="col-md-12">
                <input
                  type="number"
                  name="montantdep"
                  value={depenseData.montantdep}
                  onChange={handleInputChange}
                  placeholder="Rising"
                  className="form-control"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-12">
                <textarea
                  type="text"
                  name="description"
                  value={depenseData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="form-control"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-12">
                <select
                  className="form-select"
                  value={depenseData.CategorieNomCat}
                  name="CategorieNomCat"
                  onChange={handleInputChange}
                >
                  <option value="">--Select Category--</option>
                  {categories &&
                    categories.map((Categories, index) => (
                      <option key={index} value={Categories.NomCat}>
                        {Categories.NomCat}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="text-left">
              <button type="submit" className="btn btn-dark me-3 my-1 ">
                Add new
              </button>
              <button
                type="button"
                onClick={() => setShowAddDepensePopup(false)}
                className="btn btn-secondary my-1 "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Pop-up de modification du depense */}
      {showEditDepensePopup && selectedDepenseForEdit && depenseData && (
        <div className="popup">
          <h2>Update spent</h2>
          <form id="updateDepenseForm" onSubmit={handleConfirmEditDepense}>
            <div className="row mb-3">
              <div className="col-md-12">
                <input
                  type="number"
                  name="montantdep"
                  value={depenseData.montantdep}
                  onChange={handleInputChange}
                  placeholder="Montant"
                  className="form-control"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-12">
                <textarea
                  type="text"
                  name="description"
                  value={depenseData.description}
                  onChange={handleInputChange}
                  placeholder="Desciption"
                  className="form-control"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-12">
                <select
                  className="form-select"
                  value={depenseData.CategorieNomCat}
                  name="CategorieNomCat"
                  onChange={handleInputChange}
                >
                  <option value="">
                    {selectedDepenseForEdit.CategorieNomCat}
                  </option>
                  {categories &&
                    categories
                      .filter(
                        (category) =>
                          category.NomCat !==
                          selectedDepenseForEdit.CategorieNomCat
                      )
                      .map((category, index) => (
                        <option key={index} value={category.NomCat}>
                          {category.NomCat}
                        </option>
                      ))}
                </select>
              </div>
            </div>

            <div className="text-left">
              <button type="submit" className="btn btn-dark me-3 my-1 ">
                Update
              </button>
              <button
                type="button"
                onClick={() => setShowEditDepensePopup(false)}
                className="btn btn-secondary my-1 "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pop-up de confirmation de suppression */}
      {showDeleteDepensePopup && selectedDepenseForDelete && (
        <div className="popup">
          <h2>Delete Confirmation?</h2>
          <p>Are you sure you want to delete this spent ?</p>
          <div className="text-left">
            <button
              type="button"
              className="btn btn-danger me-3"
              onClick={handleConfirmDeleteDepense}
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteDepensePopup(false)}
              className="btn btn-secondary "
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {!loading ? (
        <div
          className={`table-container ${
            showAddDepensePopup ? "popup-visible" : ""
          }`}
        >
          <TableContainer className="ml-5" sx={{ maxWidth: 1000 }}>
            {role !== "resident" && (
              <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-dark" onClick={handleAddDepense}>
                  Add new spent
                  <AddCircleOutlineIcon className="ms-2" color="white" />
                </button>
              </div>
            )}

            <Table sx={{ maxWidth: 1000 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>Rising</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Category</StyledTableCell>
                  {role !== "resident" && (
                    <StyledTableCell>Action</StyledTableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {depenses &&
                    (rowsPerPage > 0
                      ? depenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : depenses).map((depense, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell>{depense.description}</StyledTableCell>
                      <StyledTableCell>{depense.montantdep}</StyledTableCell>
                      <StyledTableCell>
                        {" "}
                        {depense.datedep.split("-")[0]}-
                        {depense.datedep.split("-")[1]}-
                        {depense.datedep.split("-")[2].substring(0, 2)}
                      </StyledTableCell>
                      <StyledTableCell>
                        {depense.CategorieNomCat}
                      </StyledTableCell>
                      {role !== "resident" && (
                        <StyledTableCell>
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleEditDepense(depense)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            aria-label="delete"
                            onClick={() => handleDeleteDepense(depense)}
                          >
                            <DeleteIcon style={{ color: "#FD454E" }} />
                          </IconButton>
                        </StyledTableCell>
                      )}
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={depenses && depenses.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      ) : (
        <div className="load">
          <div className="loader"></div>
          <h2 className="marginLoad">Loading ...</h2>
        </div>
      )}
    </div>
  );
};

export default Depenses;
