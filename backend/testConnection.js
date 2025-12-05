const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔄 Intentando conectar a MongoDB...');
    console.log(`📍 URI: ${process.env.MONGODB_URI}`);
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ ¡Conexión exitosa!');
    console.log(`📊 Base de datos: ${mongoose.connection.name}`);
    console.log(`🖥️  Host: ${mongoose.connection.host}`);
    console.log(`🔌 Puerto: ${mongoose.connection.port}`);
    
    await mongoose.connection.close();
    console.log('👋 Desconectado');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();