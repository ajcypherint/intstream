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
#todo(aj) this script is run via a subprocess. look at st2.

from __future__ import print_function
from __future__ import unicode_literals
import sys
from train_classify import classify

#todo(aj)  options
# 2. find and replace the values below when uploading script.
# this way is easier for now.

if __name__ == "__main__":
    #activate virtualenv
    #todo(aj) split incoming text
    input_json = eval(sys.stdin.read()) # {'text':'','classifier':''}
    text = input_json["text"]
    classifier_folder = input_json["classifier"]
    print(classify(text,classifier_folder))

