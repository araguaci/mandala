# ✠ Mandala — Meditação Visual & Solfeggio

Ambiente visual imersivo para meditação e concentração com ativação visual por mandalas, intenção meditativa, códigos numéricos e sintetizador nativo de frequências Solfeggio.

## Recursos

- **5 Coleções Visuais (164 imagens):**
  - **Mandala** (`images/`) — Harmonia & Centro
  - **Base** (`_base/`) — Aterramento & Estabilidade
  - **Ação** (`_action/`) — Energia & Movimento
  - **Mente** (`_mind/`) — Foco & Clareza
  - **Intuição** (`_intuition/`) — Expansão & Insight
  - **Todas** — Modo unificado com todas as coleções
- **Sintetizador Solfeggio Nativo (Web Audio API):** frequências puras (`396 Hz` a `963 Hz`) com batimento binaural suave (4 Hz Theta) e modulação de respiração — zero dependências externas, sem erros de iframe do YouTube e funciona offline.
- **Estrutura de Intenção Meditativa:** campo para intenção pessoal + rotação dos códigos de ativação.
- **Controle de Velocidade & Movimento:** ajuste fino de `80ms` a `8s`, presets (*Subliminar*, *Pulso*, *Fluxo*, *Respiração*, *Contemplação*), modo tela cheia/inteira, respiração suave e rotação lenta.
- **Timer de Sessão:** 5, 10, 15, 20 ou 30 minutos com sino meditativo sintetizado ao concluir.
- **PWA & Portabilidade Total:** 100% estático (`index.html`, ES Modules, `manifest.webmanifest`, `sw.js`), responsivo para desktop e mobile, mantendo `index.php` como shim de compatibilidade para servidores PHP.

## Atalhos de Teclado

| Tecla | Ação |
| --- | --- |
| `Espaço` | Pausar / Reproduzir |
| `←` / `→` | Mandala anterior / próxima |
| `M` | Ligar / Desligar áudio Solfeggio |
| `F` | Tela cheia |
| `H` | Modo Zen (ocultar controles) |
| `Esc` | Fechar painel / sair do Modo Zen |

## Como executar localmente

Qualquer servidor estático ou PHP na raiz do projeto:

```bash
npx serve .
# ou
python -m http.server 8080
# ou
php -S localhost:8080
```
