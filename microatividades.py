import pandas as pd
import numpy as np

# --- Microatividade 1: Leitura de CSV ---
print("\n--- Microatividade 1 ---")
# Parâmetros: separador, engine e encoding
df = pd.read_csv('data.csv', sep=';', engine='python', encoding='utf-8')
print(df)

# --- Microatividade 2: Subconjunto de Dados ---
print("\n--- Microatividade 2 ---")
df_subset = df[['ID', 'Duration', 'Date']]
print(df_subset)

# --- Microatividade 3: Configuração de Visualização ---
print("\n--- Microatividade 3 ---")
pd.options.display.max_rows = 9999
print(df.to_string())

# --- Microatividade 4: Primeiras e Últimas N Linhas ---
print("\n--- Microatividade 4 ---")
print("Primeiras 10 linhas:")
print(df.head(10))
print("\nÚltimas 10 linhas:")
print(df.tail(10))

# --- Microatividade 5: Informações Gerais ---
print("\n--- Microatividade 5 ---")
print(df.info())
# Extração manual de informações conforme solicitado:
print(f"Total de linhas: {len(df)}")
print(f"Total de colunas: {len(df.columns)}")
print(f"Dados nulos:\n{df.isnull().sum()}")
print(f"Tipos de dados:\n{df.dtypes}")
print(f"Memória utilizada: {df.memory_usage(deep=True).sum()} bytes")
