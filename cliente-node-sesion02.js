const { Tedis } = require("tedis");

// Inicializar el cliente Redis
const tedis = new Tedis({
  host: "", // Reemplaza con tu endpoint de Redis en AWS
  port: 6379
});

async function leaderboardDemo(userId, score) {
  try {
    // 1. Agregar o actualizar la puntuación del usuario
    const zaddPayload = {};
    zaddPayload[userId] = score;
    await tedis.zadd("leaderboard", zaddPayload);
    console.log(`Puntuación actualizada para ${userId}: ${score}`);

    // 2. Obtener la puntuación del usuario
    const currentScore = await tedis.zscore("leaderboard", userId);
    console.log(`Puntuación actual del usuario ${userId}: ${currentScore}`);

    // 3. Obtener el top 10 de usuarios
    const leaderboardResponse = await tedis.zrevrange("leaderboard", 0, 9, "WITHSCORES");
    console.log("Top 10 jugadores:", leaderboardResponse);

    // 4. Obtener el rango del usuario (manejo de null)
    const rank = await tedis.zrevrank("leaderboard", userId);
    if (rank !== null) {
      console.log(`Rango del usuario ${userId}: ${rank + 1}`);
    } else {
      console.log(`El usuario ${userId} no está clasificado.`);
    }

    // Cerrar la conexión
    await tedis.close();
  } catch (error) {
    console.error("Error en la operación de leaderboard:", error);
  }
}

// Prueba con datos de ejemplo
leaderboardDemo("5de6c014-a46d-4cfb-9f94-b7bee27772fa", 1000000.9); // Ejemplo de llamada con datos de la tabla
