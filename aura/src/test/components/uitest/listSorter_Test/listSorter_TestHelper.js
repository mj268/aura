/*
 * Copyright (C) 2013 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
({
	handleApplyPressed: function(cmp, list, outCmpName) {
		//if list contains "-" then its descending order
		var desc = "-";
		list = list.toString();
		var sortOrder;
		//ascending order
		if(!list.indexOf(desc) != -1){
			list = list.replace("-","");
			sortOrder = list + " : Z-A"
		}
		else{
			sortOrder = list + " : A-Z"
		}
		var resultCmp = cmp.find(outCmpName);
        resultCmp.setValue("v.value", sortOrder);
    }
})