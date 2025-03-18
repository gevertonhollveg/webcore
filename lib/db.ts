import mysql from "mysql2/promise"

// Configuração da conexão MySQL
export async function getConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      ssl: process.env.NODE_ENV === "production" ? {} : undefined,
    })

    return connection
  } catch (error) {
    console.error("Erro ao conectar ao MySQL:", error)
    throw new Error("Falha na conexão com o banco de dados")
  }
}

// Função para executar queries SQL com proteção contra injeção SQL
export async function query(sql: string, params: any[] = []) {
  const connection = await getConnection()
  try {
    const [results] = await connection.execute(sql, params)
    return results
  } catch (error) {
    console.error("Erro na execução da query:", error)
    throw error
  } finally {
    await connection.end()
  }
}

// Inicialização do banco de dados
export async function initializeDatabase() {
  try {
    // Tabela de usuários
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        security_question VARCHAR(255) NOT NULL,
        security_answer TEXT NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        credits INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
      )
    `)

    // Tabela de personagens
    await query(`
      CREATE TABLE IF NOT EXISTS characters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        class VARCHAR(50) NOT NULL,
        level INT NOT NULL DEFAULT 1,
        experience INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Tabela de transações
    await query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        credits INT NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_id VARCHAR(255) NOT NULL,
        status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Tabela de sessões
    await query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    console.log("Banco de dados inicializado com sucesso")
  } catch (error) {
    console.error("Falha ao inicializar o banco de dados:", error)
  }
}

