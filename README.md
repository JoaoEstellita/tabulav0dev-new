# Tábula Estelar (Frontend PWA)

## Preview social (Meta/Twitter)
- O root `https://www.tabulaestelar.com.br/` é servido por `public/landing.html`.
- As tags Open Graph/Twitter devem ser alteradas nesse arquivo.
- O build copia `landing.html`, `manifest.json`, `robots.txt` e `sitemap.xml` para `dist/`.

## Validação rápida
1. Build:
   - `npm run build:web`
2. Facebook Sharing Debugger:
   - Abra https://developers.facebook.com/tools/debug/
   - Cole `https://www.tabulaestelar.com.br/`
   - Confirme `title`, `description` e `image`
   - Clique em `Scrape Again` após qualquer alteração
3. Compartilhamento real:
   - Teste no WhatsApp e Instagram DM com o link da home
   - Verifique card com imagem/título/descrição
