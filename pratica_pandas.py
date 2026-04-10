import pandas as pd
import numpy as np

# Leitura do arquivo CSV
df = pd.read_csv('data.csv', sep=';', engine='python', encoding='utf-8')

# Verificando se os dados foram importados corretamente
print("--- Informacoes gerais ---")
print(df.info())

print("\n--- Primeiras 10 linhas ---")
print(df.head(10))

print("\n--- Ultimas 10 linhas ---")
print(df.tail(10))

# Criando uma copia do dataset original
df_copy = df.copy()

# Substitui os valores nulos da coluna Calories por 0
df_copy['Calories'] = df_copy['Calories'].fillna(0)
print("\n--- Apos preencher Calories com 0 ---")
print(df_copy)

# Substitui os valores nulos da coluna Date por '1900/01/01'
df_copy['Date'] = df_copy['Date'].fillna('1900/01/01')
print("\n--- Apos preencher Date com 1900/01/01 ---")
print(df_copy)

# Primeira tentativa de converter Date para datetime (deve gerar erro)
try:
    df_copy['Date'] = pd.to_datetime(df_copy['Date'], format='%Y/%m/%d')
except Exception as e:
    print(f"\nErro esperado na primeira conversao: {e}")

# Substitui o '1900/01/01' por NaN
df_copy['Date'] = df_copy['Date'].replace('1900/01/01', np.nan)

# Segunda tentativa de converter (ainda deve gerar erro por causa do 20201226)
try:
    df_copy['Date'] = pd.to_datetime(df_copy['Date'], format='%Y/%m/%d')
except Exception as e:
    print(f"\nErro esperado na segunda conversao: {e}")

# Trata o valor 20201226 (que esta fora do padrao AAAA/MM/DD)
df_copy['Date'] = df_copy['Date'].replace('20201226', '2020/12/26')

# Conversao final da coluna Date para datetime
# (o CSV traz as datas entre aspas simples, entao removo antes de converter)
df_copy['Date'] = pd.to_datetime(df_copy['Date'].str.strip("'"), format='%Y/%m/%d')
print("\n--- Apos todas as correcoes na coluna Date ---")
print(df_copy)

# Remove os registros com valores nulos (linha 22)
df_copy = df_copy.dropna(subset=['Date'])

# Dataframe final, ja limpo
print("\n--- Dataframe final ---")
print(df_copy)
