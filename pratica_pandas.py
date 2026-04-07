import pandas as pd
import numpy as np

# 3. Leia o conteúdo do CSV fornecido
df = pd.read_csv('data.csv', sep=';', engine='python', encoding='utf-8')

# 5. Verifique se os dados foram importados adequadamente
print("--- Informações Gerais ---")
print(df.info())
print("\n--- Primeiras 10 linhas ---")
print(df.head(10))
print("\n--- Últimas 10 linhas ---")
print(df.tail(10))

# 6. Crie uma nova variável e atribua a ela uma cópia do conjunto de dados original
df_copy = df.copy()

# 7. Substitua todos os valores nulos da coluna 'Calories' por 0
df_copy['Calories'] = df_copy['Calories'].fillna(0)
print("\n--- Após preencher Calories com 0 ---")
print(df_copy)

# 8. Substitua os valores nulos da coluna 'Date' por '1900/01/01'
df_copy['Date'] = df_copy['Date'].fillna('1900/01/01')
print("\n--- Após preencher Date com 1900/01/01 ---")
print(df_copy)

# Tentar transformar em datetime (Erro esperado)
try:
    print("\nTentando converter Date para datetime...")
    df_copy['Date'] = pd.to_datetime(df_copy['Date'], format='%Y/%m/%d')
except Exception as e:
    print(f"Erro esperado: {e}")

# 9. Resolver o problema do 1900/01/01
df_copy['Date'] = df_copy['Date'].replace('1900/01/01', np.nan)

# Tentar converter novamente (Erro esperado para 20201226)
try:
    print("\nTentando converter Date para datetime novamente...")
    df_copy['Date'] = pd.to_datetime(df_copy['Date'], format='%Y/%m/%d')
except Exception as e:
    print(f"Erro esperado (20201226): {e}")

# 10. Transformar especificamente o valor "20201226"
df_copy['Date'] = df_copy['Date'].replace('20201226', '2020/12/26')

# 11. Execute novamente a transformação de todos os dados da coluna 'Date'
df_copy['Date'] = pd.to_datetime(df_copy['Date'])
print("\n--- Após correções na coluna Date ---")
print(df_copy)

# 12. Remova os registros contendo valores nulos (baseado na coluna Date)
df_copy.dropna(subset=['Date'], inplace=True)

# 13. Imprima o dataframe final
print("\n--- Dataframe Final (Limpo) ---")
print(df_copy)
