import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Database/firebaseconfig';
import GraficoProductos from '../components/Estadisticas/GraficoProductos';

const Estadisticas = () => {


    const [productos, setProductos] = useState([]);
    const productosCollection = collection(db, 'productos');

    const nombres = productos.map((producto) => producto.nombre);
    const precios = productos.map((producto) => parseFloat(producto.precio));

    useEffect(() => {
        const unsubscribe = onSnapshot(productosCollection, (snapshot) => {
            const fetchedProducts = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setProductos(fetchedProducts);
        }, (error) => {
            console.error('Error al cargar productos:', error);
            alert('Error al cargar productos: ' + error.message);
        });

        return () => unsubscribe();
    }, []);


    return (
        <Container className="mt-">
            <br />
            <h4> Estadisticas </h4>
            <Row className="mt-4">
                <Col xs={12} sm={12} lg={6} className="mb-4">
                    <GraficoProductos nombres={nombres} precios={precios}/>
                </Col>
            </Row>
        </Container>
    );

};

export default Estadisticas;