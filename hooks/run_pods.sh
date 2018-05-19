#!/bin/bash
project_dir=$(pwd)/platforms/ios
echo project_dir = $project_dir
pod install --project-directory=$project_dir
