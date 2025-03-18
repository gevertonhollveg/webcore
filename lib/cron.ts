import { generateRanking } from "./admin-actions"
import { loadConfig } from "./admin-actions"

// Função para iniciar o cron job de atualização do ranking
export async function startRankingCron() {
  try {
    // Carregar configurações
    const config = await loadConfig()
    const rankingConfig = config.ranking

    if (!rankingConfig.enabled) {
      console.log("Atualização automática de ranking está desativada nas configurações.")
      return
    }

    // Intervalo em minutos
    const interval = rankingConfig.updateInterval || 15

    // Converter para milissegundos
    const intervalMs = interval * 60 * 1000

    // Gerar ranking inicial
    await generateRanking()
    console.log(`Ranking inicial gerado. Próxima atualização em ${interval} minutos.`)

    // Configurar intervalo para atualizações periódicas
    setInterval(async () => {
      try {
        // Recarregar configurações a cada execução para pegar alterações
        const refreshedConfig = await loadConfig()
        const refreshedRankingConfig = refreshedConfig.ranking

        if (!refreshedRankingConfig.enabled) {
          console.log("Atualização automática de ranking está desativada nas configurações.")
          return
        }

        await generateRanking()
        console.log(`Ranking atualizado em ${new Date().toISOString()}`)
      } catch (error) {
        console.error("Erro ao atualizar ranking:", error)
      }
    }, intervalMs)
  } catch (error) {
    console.error("Erro ao iniciar cron job de ranking:", error)
  }
}

