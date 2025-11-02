# Configuração de Pagamentos Stripe

## Visão Geral

Esta aplicação está preparada para integração com Stripe para processamento de pagamentos mensais de arrendamento (RF-8 e RF-9).

## Requisitos

- Conta Stripe (https://dashboard.stripe.com/register)
- Chave secreta do Stripe (obtida no Dashboard)
- Taxa da plataforma: 5% sobre cada transação

## Implementação Necessária

### 1. Configurar Stripe Secret Key

Adicione a chave secreta do Stripe como variável de ambiente no Supabase:

```bash
# No dashboard do Supabase, vá em Settings > Edge Functions
# Adicione a variável:
STRIPE_SECRET_KEY=sk_test_...
```

### 2. Criar Edge Function para Pagamentos

Será necessário criar uma Edge Function do Supabase para:

- Criar sessões de checkout do Stripe
- Processar webhooks do Stripe
- Registar pagamentos na tabela `payments`
- Calcular e distribuir:
  - 5% para a plataforma (`platform_fee`)
  - 95% para o idoso (`elderly_amount`)

### 3. Tabelas Relevantes

A base de dados já está preparada com as seguintes tabelas:

#### `rentals`
- Contratos de arrendamento ativos
- `monthly_amount`: Valor mensal do aluguer

#### `payments`
- Registo de todos os pagamentos
- `amount`: Valor total pago pelo estudante
- `platform_fee`: Taxa de 5% da plataforma
- `elderly_amount`: 95% que vai para o idoso
- `stripe_payment_id`: ID da transação Stripe
- `status`: pending, completed, failed

### 4. Fluxo de Pagamento

1. Estudante inicia pagamento mensal
2. Edge Function cria sessão Stripe Checkout
3. Estudante completa pagamento no Stripe
4. Webhook do Stripe notifica a aplicação
5. Sistema regista pagamento na base de dados
6. Sistema atualiza status do rental

### 5. Método de Pagamento

Conforme RC-1, apenas transferência bancária está disponível.
Configure o Stripe para aceitar apenas:
- SEPA Direct Debit (para Portugal)
- Bank transfers

### 6. Recursos

- Documentação Stripe: https://stripe.com/docs
- Stripe com Supabase: https://supabase.com/docs/guides/functions/examples/stripe-webhooks
- Link de configuração: https://bolt.new/setup/stripe

## Nota Importante

⚠️ **A integração com Stripe não foi implementada no código**, pois requer:
- Chave secreta do Stripe (não pode ser hardcoded)
- Configuração de webhooks
- Testes em ambiente de produção

O sistema de pagamentos está preparado ao nível da base de dados, mas a integração efetiva com a API do Stripe deve ser feita quando tiver credenciais válidas.

## Alternativa para Mobile

Para pagamentos in-app em aplicações móveis nativas (iOS/Android), considere usar **RevenueCat** em vez de Stripe, pois:
- Stripe não suporta subscriptions nativas da App Store/Google Play
- RevenueCat integra-se com ambas as plataformas
- Documentação: https://www.revenuecat.com/docs/getting-started/installation/expo
