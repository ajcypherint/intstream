SHELL := /bin/bash

# SET THIS! Directory containing wsgi.py
# PROJECT := someproject

.PHONY: clean 

clean:
	find . -name "*.pyc" -print0 | xargs -0 rm -rf
	-rm -rf htmlcov
	-rm -rf .coverage
	-rm -rf build
	-rm -rf dist
	-rm -rf src/*.egg-info


