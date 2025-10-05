import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import TablaCategorias from "../components/categorias/TablaCategorias";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const categoriasCollection = collection(db, "Categorias");

    // Estados para manejo del modal de registro
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevaCategoria, setNuevaCategoria] = useState({
        nombre: "",
        descripcion: "",
    });

    // Manejador de cambios en inputs del formulario de nueva categoría
    const manejoCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevaCategoria((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Agregar nueva categoría a Firestore
    const agregarCategoria = async () => {
        if (!nuevaCategoria.nombre || !nuevaCategoria.descripcion) {
            alert("Por favor, completa todos los campos antes de guardar.");
            return;
        }

        setMostrarModal(false);

        try {
            const categoriasCollection = collection(db, "Categorias");
            await addDoc(categoriasCollection, nuevaCategoria);

            setNuevaCategoria({ nombre: "", descripcion: "" });
            cargarCategorias();
            console.log("✅ Categoría agregada exitosamente.");
        } catch (error) {
            console.error("❌ Error al agregar la categoría:", error);
            alert("Error al agregar la categoría: " + error.message);
        }
    };

    // Cargar categorías desde Firestore
    const cargarCategorias = async () => {
        try {
            const consulta = await getDocs(categoriasCollection);
            const datosCategorias = consulta.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategorias(datosCategorias);
            console.log("📦 Categorías cargadas:", datosCategorias);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    return (
        <Container className="mt-4">
            <h4>Gestión de Categorías</h4>
            <Row>
                <Col lg={3} md={4} sm={4} xs={5}>
                    <Button
                        className="mb-3"
                        onClick={() => setMostrarModal(true)}
                        style={{ width: "100%" }}
                    >
                        Agregar categoría
                    </Button>
                </Col>
            </Row>

            {/* 🧩 Modal para agregar nueva categoría */}
            <ModalRegistroCategoria
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevaCategoria={nuevaCategoria}
                manejoCambioInput={manejoCambioInput}
                agregarCategoria={agregarCategoria}
            />

            {/* 📋 Tabla de categorías */}
            <TablaCategorias categorias={categorias} />
        </Container>
    );
};

export default Categorias;
