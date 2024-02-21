from cryptography import fernet

fernet_key = fernet.Fernet.generate_key().decode()
print(fernet_key)
