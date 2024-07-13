import site
import sys

sys.path.insert(0, '/home/debian/.pyenv/versions/apache2_wsgi/lib/python3.12/site-packages')
sys.path.insert(0, '/home/ubuntu/.pyenv/versions/apache2_wsgi/lib/python3.12/site-packages')

site.addsitedir('/home/debian/.pyenv/versions/apache2_wsgi/lib/python3.12/site-packages')
site.addsitedir('/home/ubuntu/.pyenv/versions/apache2_wsgi/lib/python3.12/site-packages')

sys.path.insert(0, '/home/debian/thoth-edu/thoth-edu/Backend')
sys.path.insert(0, '/home/ubuntu/thoth-edu/thoth-edu/Backend')

from main import app as application