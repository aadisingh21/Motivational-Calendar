from setuptools import setup, find_packages

setup(
    name="motivational-desktop-app",
    version="1.0.0",
    description="Desktop application for daily motivational quotes",
    packages=find_packages(),
    install_requires=[
        "requests>=2.31.0",
        "schedule>=1.2.0",
    ],
    python_requires=">=3.7",
    entry_points={
        "console_scripts": [
            "motivational-app=main:main",
        ],
    },
)