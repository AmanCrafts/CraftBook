import mysql from 'mysql2';
import express from 'express';

const db = mysql.createConnection({
    host: process.env.EXPO_PUBLIC_DB_HOST,
    user: process.env.EXPO_PUBLIC_DB_USER,
    password: process.env.EXPO_PUBLIC_DB_PASSWORD,
    database: process.env.EXPO_PUBLIC_DB_NAME
})

