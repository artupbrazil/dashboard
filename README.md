# Art Up — Dashboard

## Rodando localmente (opcional, só se quiser testar antes de publicar)

```bash
npm install
cp .env.local.example .env.local
# edita .env.local com a NEXT_PUBLIC_SUPABASE_ANON_KEY de verdade
npm run dev
```

## Publicando no GitHub

```bash
cd dashboard-app
git init
git add .
git commit -m "Primeira versão: login + Clientes"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/art-up-dashboard.git
git push -u origin main
```

## Publicando no Easypanel (dashboard.artup.online)

1. No Easypanel, cria um serviço novo do tipo **App** (não "Compose", diferente do Supabase) dentro do projeto `servidor_principal`.
2. Fonte: **Git**, aponta pro repositório que você acabou de criar (`https://github.com/SEU-USUARIO/art-up-dashboard.git`), branch `main`.
3. Build: o Easypanel deve detectar o `Dockerfile` automaticamente. Se pedir pra confirmar, o caminho é a raiz do repositório.
4. Em **Variáveis de ambiente do build** (build args), adiciona:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://supabase.artup.online`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua anon key
5. Em **Domínios**, cria `dashboard.artup.online` apontando pro serviço, porta `3000` (é a porta que o `Dockerfile` expõe).
6. Implanta.

## O que já funciona nessa primeira versão

- Login com e-mail/senha (mesma auth do Supabase que já testamos)
- Lista de clientes, com contagem de contas de anúncio
- Cadastrar novo cliente
- Ver detalhe do cliente e vincular conta de anúncio (Meta ou Google)
- Tudo respeitando a RLS: usuário `client` só veria os próprios dados (a UI ainda não distingue as duas visões, isso vem na próxima etapa)

## Próximos passos sugeridos

- Tela de Campanhas com métricas e comparação de período (o motivo de tudo isso existir)
- Visão separada pro papel `client` (hoje a navegação é igual pra todo mundo)
- Editar/pausar cliente existente
