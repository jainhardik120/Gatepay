import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "./TransactionList.css"

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isDialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://gatepay-server.vercel.app/api/payments/spaceTransactions', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error.message);
        }
    };

    const openDetailsDialog = async (transactionId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://gatepay-server.vercel.app/api/payments/spaceTransactions/${transactionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch transaction details');
            }

            const data = await response.json();
            setSelectedTransaction(data);
            setDialogOpen(true);
        } catch (error) {
            console.error('Error fetching transaction details:', error.message);
        }
    };

    const closeDetailsDialog = () => {
        setDialogOpen(false);
        setSelectedTransaction(null);
    };


    const renderDetailsDialogContent = () => {
        const userType = localStorage.getItem('type');

        if (userType === 'Toll') {
            const { vehicleno, manufacturer, model, color, entrylocationcoordinates, exitlocationcoordinates, entrytime, exittime, transactionid } =
                selectedTransaction;

            return (
                <>
                    <p>Entry Time : {entrytime}</p>
                    <p>Exit Time : {exittime}</p>
                    <p>Transaction ID : {transactionid}</p>
                    <p>Vehicle Number: {vehicleno}</p>
                    <p>Manufacturer: {manufacturer}</p>
                    <p>Model: {model}</p>
                    <p>Color: {color}</p>
                    <p>Entry Location Coordinates: {entrylocationcoordinates}</p>
                    <p>Exit Location Coordinates: {exitlocationcoordinates}</p>
                </>
            );
        } else {
            const { vehicleno, manufacturer, model, color, entrytime, exittime, transactionid, parkingspaceid } =
                selectedTransaction;

            return (
                <>
                    <p>Entry Time : {entrytime}</p>
                    <p>Exit Time : {exittime}</p>
                    <p>Transaction ID : {transactionid}</p>
                    <p>Vehicle Number: {vehicleno}</p>
                    <p>Manufacturer: {manufacturer}</p>
                    <p>Model: {model}</p>
                    <p>Color: {color}</p>
                    <p>Parking Space Alloted : {parkingspaceid}</p>
                </>
            );
        }

    };

    return (
        <div>
            <h2>Transaction List</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <>
                            <TableRow className='table-row' key={transaction.transactionid}>
                                <TableCell>Date: {new Date(transaction.date).toLocaleString()}</TableCell>
                                <TableCell>Amount: {transaction.amount}</TableCell>
                                <TableCell>Transaction ID: {transaction.transactionid}</TableCell>
                                <TableCell>
                                    <Button onClick={() => openDetailsDialog(transaction.transactionid)}>View Details</Button>
                                </TableCell>
                            </TableRow>
                            <br/>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedTransaction && (
                <Dialog open={isDialogOpen} onClose={closeDetailsDialog}>
                    <DialogTitle>Transaction Details</DialogTitle>
                    <DialogContent>{renderDetailsDialogContent()}</DialogContent>
                    <DialogActions>
                        <Button onClick={closeDetailsDialog}>Close</Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
};

export default TransactionList;
