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
import json

#todo(aj)  options
# 2. find and replace the values below when uploading script.
# this way is easier for now.


class MissingArgs(Exception):
    pass


class ExtraArgs(Exception):
    pass


if __name__ == "__main__":
    # arg len = 6 or 7 is ok
    if len(sys.argv) < 6:
        raise MissingArgs
    if len(sys.argv) > 7:
        raise ExtraArgs
    extra_kwargs = {}
    if len(sys.argv) == 7:
        extra_kwargs = json.loads(sys.argv[6])

    INPUT_BUCKET = sys.argv[1]
    JOB_NAME = sys.argv[2]
    OUTPUT_FILE = sys.argv[3]
    OUTPUT_METRIC_FILE = sys.argv[4]
    METRIC = sys.argv[5]

    train(INPUT_BUCKET, JOB_NAME, OUTPUT_FILE, OUTPUT_METRIC_FILE, METRIC, extra_kwargs)

