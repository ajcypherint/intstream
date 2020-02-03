#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

from __future__ import print_function
from __future__ import unicode_literals
import sys
from operator import add
from pyspark import SparkContext
from train_classify import train
#todo(aj)  options
# 2. find and replace the values below when uploading script.
# this way is easier for now.


class MissingArgs(Exception):
    pass


INPUT_BUCKET = sys.argv[1]
OUTPUT_FILE = sys.argv[2]
OUTPUT_METRIC_FILE = sys.argv[3]

if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise MissingArgs
    train(INPUT_BUCKET, OUTPUT_FILE, OUTPUT_METRIC_FILE)

