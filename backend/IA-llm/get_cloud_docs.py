import requests

def get_cloud_docs(doc_url):
    file = requests.get(doc_url, stream=True, verify=False)
    file_name = doc_url.split("/")[-1]
    with open(file_name, "wb") as f:
        f.write(file.content)
    return file_name