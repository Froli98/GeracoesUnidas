/*
  # Adicionar Métodos de Pagamento e Serviços aos Quartos

  1. Novas Colunas na Tabela `rooms`
    - `payment_methods` (text[]) - Métodos de pagamento aceitos (Transferência, MB WAY, Dinheiro, etc.)
    - `services` (jsonb) - Serviços adicionais oferecidos com preços
      Exemplo: {
        "room_cleaning": { "enabled": true, "price": 50 },
        "lunch": { "enabled": true, "price": 150 },
        "dinner": { "enabled": true, "price": 150 },
        "custom_services": [
          { "name": "Lavandaria", "price": 30 }
        ]
      }
    - `total_monthly_price` (numeric) - Preço total mensal incluindo serviços

  2. Notas Importantes
    - Os serviços são opcionais e personalizaveis
    - O preço total é calculado automaticamente
    - Compatibilidade com quartos existentes (valores default)
*/

-- Adicionar colunas à tabela rooms
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS payment_methods text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS services jsonb DEFAULT '{"room_cleaning":{"enabled":false,"price":0},"lunch":{"enabled":false,"price":0},"dinner":{"enabled":false,"price":0},"custom_services":[]}',
ADD COLUMN IF NOT EXISTS total_monthly_price numeric DEFAULT 0;

-- Atualizar total_monthly_price para quartos existentes (igualando ao monthly_price)
UPDATE rooms 
SET total_monthly_price = monthly_price 
WHERE total_monthly_price = 0 OR total_monthly_price IS NULL;

-- Criar índice para melhorar performance de queries com serviços
CREATE INDEX IF NOT EXISTS rooms_services_idx ON rooms USING GIN (services);

-- Adicionar comentários para documentação
COMMENT ON COLUMN rooms.payment_methods IS 'Métodos de pagamento aceitos pelo host';
COMMENT ON COLUMN rooms.services IS 'Serviços adicionais oferecidos com preços';
COMMENT ON COLUMN rooms.total_monthly_price IS 'Preço total mensal incluindo serviços selecionados';