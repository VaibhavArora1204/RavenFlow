import requests

from bs4 import BeautifulSoup


def fetch_page_content(url: str):

    headers = {
        "User-Agent": (
            "RavenFlowBot/1.0 "
            "(learning project)"
        )
    }

    response = requests.get(
        url,
        headers=headers,
        timeout=10
    )

    response.raise_for_status()

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )

    for tag in soup(["script", "style", "nav"]):
        tag.decompose()

    paragraphs = soup.find_all("p")

    text = " ".join(
        p.get_text(separator=" ", strip=True)
        for p in paragraphs
    )

    cleaned_text = " ".join(text.split())

    return cleaned_text[:5000]