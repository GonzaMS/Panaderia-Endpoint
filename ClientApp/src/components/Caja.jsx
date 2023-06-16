import "../css/custom.css"
import React, { Component } from "react";
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import {

    Container,

} from "reactstrap";

export class Caja extends Component {

    render() {
        return (
            <>
                <Container>
                    <div className="row">
                        <div className="col-sm-10 col-md-8 text-center" >
                            <p>PANADERIA </p>
                        </div>
                        <div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button type="button" className="btn btn-warning">Informe de Arqueos</button>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="card" style={{ width: '18rem' }}>
                            <div className="card-body">
                                <h5 className="card-title">ABRIR NUEVA CAJA</h5>
                                <Link to='/IniciarCaja' className="custom-link">
                                    <div className="d-grid gap-2">
                                        <button type="button" className="btn btn-outline-secondary">Abrir</button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <br />
                    <div className="card" style={{ width: '60rem' }}>
                        <div className="card-body">
                            <h5 className="card-title">VENTAS POR DIAS</h5>
                            <div className="d-flex flex-column">
                                <div>
                                    <div className="progress mb-3" role="progressbar" aria-label="Warning example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-warning text-dark" style={{ width: '25%' }}>25%</div>
                                    </div>
                                    <div className="progress mb-3" role="progressbar" aria-label="Warning example" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-warning text-dark" style={{ width: '50%' }}>50%</div>
                                    </div>
                                    <div className="progress mb-3" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-warning text-dark" style={{ width: '75%' }}>75%</div>
                                    </div>
                                    <div className="progress mb-3" role="progressbar" aria-label="Warning example" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-warning text-dark" style={{ width: '10%' }}>10%</div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="card" style={{ width: '60rem' }}>
                        <div className="card-body">
                            <h5 className="card-title">STOCK DE MATERIA PRIMA</h5>
                            <div className="d-flex flex-column">
                                <div>
                                    <div className="progress mb-3" role="progressbar" aria-label="Warning example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-warning text-dark" style={{ width: '25%' }}>25%</div>
                                    </div>
                                    <div className="progress mb-3" role="progressbar" aria-label="Warning example" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-warning text-dark" style={{ width: '50%' }}>50%</div>
                                    </div>
                                    <div className="progress mb-3" role="progressbar" aria-label="Warning example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-warning text-dark" style={{ width: '75%' }}>75%</div>
                                    </div>
                                    <div className="progress mb-3" role="progressbar" aria-label="Warning example" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">
                                        <div className="progress-bar bg-warning text-dark" style={{ width: '10%' }}>10%</div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                </Container>

            </>
        );
    }
} 