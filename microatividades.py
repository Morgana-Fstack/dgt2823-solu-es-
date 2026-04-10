import pandas as pd

# Microatividade 1: leitura do CSV
print("\n--- Microatividade 1 ---")
df = pd.read_csv('data.csv', sep=';', engine='python', encoding='utf-8')
print(df)

# Microatividade 2: subconjunto de colunas
print("\n--- Microatividade 2 ---")
df_subset = df[['ID', 'Duration', 'Date']]
print(df_subset)

# Microatividade 3: configuração de visualização
print("\n--- Microatividade 3 ---")
pd.options.display.max_rows = 9999
print(df.to_string())

# Microatividade 4: primeiras e últimas 10 linhas
print("\n--- Microatividade 4 ---")
print("Primeiras 10 linhas:")
print(df.head(10))
print("\nÚltimas 10 linhas:")
print(df.tail(10))

# Microatividade 5: informações gerais
print("\n--- Microatividade 5 ---")
print(df.info())
print(f"Total de linhas: {len(df)}")
print(f"Total de colunas: {len(df.columns)}")
print(f"Dados nulos por coluna:\n{df.isnull().sum()}")
print(f"Tipos de dados:\n{df.dtypes}")
print(f"Memória utilizada: {df.memory_usage(deep=True).sum()} bytes")
